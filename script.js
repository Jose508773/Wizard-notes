let notes = document.getElementById("users-notes");
let form = document.getElementById("notes-form");
let notesResult = document.getElementById("notes-result");

async function getNotes(e) {
    e.preventDefault()
    let userNotes = notes.value
    if (!userNotes.trim()) return
    let response = await fetch("/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ notesToAdd: userNotes })
    })
    if (!response.ok) {
        notesResult.textContent = "Error: " + response.status
        return
    }
    let data = await response.json()
    notesResult.textContent = Array.isArray(data.addedNotes) ? data.addedNotes.join(", ") : data.addedNotes
    notes.value = ""
}

form.addEventListener("submit", getNotes)

