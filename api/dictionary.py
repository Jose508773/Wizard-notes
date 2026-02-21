import os
import json
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


# ── Helper functions ──────────────────────────────────────────

def supabase_request(method, path, body=None, token=None):
    """Make a REST API call to Supabase and return (data, status)."""
    parsed = urlparse(SUPABASE_URL)
    conn = HTTPSConnection(parsed.hostname)

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {token or SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    conn.request(method, path, body=json.dumps(body) if body else None, headers=headers)
    res = conn.getresponse()
    data = json.loads(res.read().decode())
    conn.close()
    return data, res.status


def get_user_id(request: Request):
    """Pull the Bearer token from the request and ask Supabase who the user is."""
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None

    token = auth.removeprefix("Bearer ")
    data, status = supabase_request("GET", "/auth/v1/user", token=token)
    return data.get("id") if status < 400 else None


# ── Routes ────────────────────────────────────────────────────

@app.post("/api/dictionary")
async def add_word(request: Request, body: dict = Body(...)):
    user_id = get_user_id(request)
    if not user_id:
        return {"error": "Not authenticated. Please sign in."}

    word = body.get("word", "")
    definition = body.get("definition", "")

    if not word or not definition:
        return {"error": "Both word and definition are required"}

    data, status = supabase_request("POST", "/rest/v1/dictionary", {"word": word, "definition": definition, "user_id": user_id})
    return {"error": str(data)} if status >= 400 else {"success": True, "data": data}


@app.get("/api/dictionary")
async def get_words(request: Request):
    user_id = get_user_id(request)
    if not user_id:
        return {"error": "Not authenticated. Please sign in."}

    data, status = supabase_request("GET", f"/rest/v1/dictionary?select=*&user_id=eq.{user_id}&order=created_at.desc")
    return {"error": str(data)} if status >= 400 else {"data": data}
