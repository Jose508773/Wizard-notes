let notes = document.getElementById("users-notes");
let form = document.getElementById("notes-form");
let notesResult = document.getElementById("notes-result");
let getPeopleBtn = document.getElementById("get-people-btn");
let peopleResultGet = document.getElementById("people-result-get");



async function get_people() {
    let response = await fetch("api/notes");
    let data = await response.json();
    peopleResultGet.textContent = data.notes;
}
getPeopleBtn.addEventListener("click", get_people);


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



