from fastapi import FastAPI

app = FastAPI()

@app.get("/api")
async def root():
    return {"message": "Hello from Python FastAPI on Vercel! 🐍", "endpoints": ["/api", "/api/hello", "/api/users"]}
