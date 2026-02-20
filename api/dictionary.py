import os
import json
import base64
from http.client import HTTPSConnection
from urllib.parse import urlparse
from fastapi import FastAPI, Body, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")


def get_user_id(request: Request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth.split("Bearer ")[1]
    # Ask Supabase to validate the token and return the user
    data, status = supabase_request("GET", "/auth/v1/user", token=token)
    if status >= 400:
        return None
    return data.get("id")



def supabase_request(method, path, body=None, token=None):
    """Make a direct REST API call to Supabase."""
    parsed = urlparse(SUPABASE_URL)
    conn = HTTPSConnection(parsed.hostname)

    # Use the user's token if provided, otherwise use the service key
    auth_token = token if token else SUPABASE_KEY

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    conn.request(method, path, body=json.dumps(body) if body else None, headers=headers)
    res = conn.getresponse()
    data = json.loads(res.read().decode())
    conn.close()
    return data, res.status


@app.post("/api/dictionary")
async def add_word(request: Request, body: dict = Body(...)):
    user_id = get_user_id(request)
    if not user_id:
        return {"error": "Not authenticated. Please sign in."}

    word = body.get("word", "")
    definition = body.get("definition", "")

    if not word or not definition:
        return {"error": "Both word and definition are required"}

    row = {"word": word, "definition": definition, "user_id": user_id}
    data, status = supabase_request("POST", "/rest/v1/dictionary", row)

    if status >= 400:
        return {"error": str(data)}

    return {"success": True, "data": data}


@app.get("/api/dictionary")
async def get_words(request: Request):
    user_id = get_user_id(request)
    if not user_id:
        return {"error": "Not authenticated. Please sign in."}

    # Filter by user_id so each user only sees their own words
    path = f"/rest/v1/dictionary?select=*&user_id=eq.{user_id}&order=created_at.desc"
    data, status = supabase_request("GET", path)

    if status >= 400:
        return {"error": str(data)}

    return {"data": data}
