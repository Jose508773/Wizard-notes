from fastapi import FastAPI, Body

app = FastAPI()

notes = []


@app.post("/api/notes")
async def add_notes(body: dict = Body(...)):
    notes_to_add = body.get("notesToAdd", "")
    notes.append(notes_to_add)
    return {"addedNotes": notes}
  


@app.get("/api/notes")
async def get_notes():
    return {"notes": notes}