from fastapi import FastAPI, Response
from fastapi import Body
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/test_ing")
async def root(response: Response):
    response.headers["Cache-Control"] = "public, max-age=300"
    return {"response": "✅ API is working! Connection successful.", "cached": True}


people = {}

@app.post("/api/test_ing")
async def add_person(body: dict = Body(...)):
    users_name = body.get("userName", "")
    users_age = body.get("userAge", 0)
    people["name"] = users_name
    people["age"] = users_age
    return {"people": people, "message": "Person added successfully!"}
