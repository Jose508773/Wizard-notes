from fastapi import FastAPI
from fastapi import Body
app = FastAPI()

@app.get("/api/test")
async def root():
    return {"response": "ITs working!!!!!!!"}


people = {}
@app.post("/api/test")
async def add_person(body: dict = Body(...)):
    users_name = body.get("userName", "")
    users_age = body.get("userAge", 0)
    people["name"] = users_name
    people["age"] = users_age
    return {"people": people}


