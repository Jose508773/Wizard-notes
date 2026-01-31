from fastapi import FastAPI

app = FastAPI()

@app.get("/api/hello")
async def hello():
    return {"message": "Hello from me the server master"}

@app.get("/api/hello/{name}")
async def hello_name(name: str):
    return {"message": f"Hello {name}, from the server master!"}
