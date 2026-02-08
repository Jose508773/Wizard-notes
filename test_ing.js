// Test_ing JavaScript

const testBtn = document.getElementById("test-btn");
const testResult = document.getElementById("test-result");

const personForm = document.getElementById("person-form");
const nameInput = document.getElementById("name-input");
const ageInput = document.getElementById("age-input");
const personResult = document.getElementById("person-result");

const showPeopleBtn = document.getElementById("show-people-btn");
const peopleResult = document.getElementById("people-result");

// Test API connection
async function testConnection() {
    testResult.textContent = "Loading...";

    try {
        const response = await fetch("/api/test_ing");
        const data = await response.json();
        testResult.textContent = data.response;
    } catch (error) {
        testResult.textContent = "Error: " + error.message;
    }
}

// Add a person
async function addPerson(event) {
    event.preventDefault();
    personResult.textContent = "Loading...";

    const name = nameInput.value.trim();
    const age = ageInput.value;

    if (!name || !age) {
        personResult.textContent = "Please fill in all fields";
        return;
    }

    try {
        const response = await fetch("/api/test_ing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userName: name, userAge: parseInt(age) })
        });
        const data = await response.json();
        personResult.textContent = JSON.stringify(data.people);
        nameInput.value = "";
        ageInput.value = "";
    } catch (error) {
        personResult.textContent = "Error: " + error.message;
    }
}

// Show all people
async function showPeople() {
    peopleResult.textContent = "Loading...";

    try {
        const response = await fetch("/api/test_ing");
        const data = await response.json();
        peopleResult.textContent = data.response;
    } catch (error) {
        peopleResult.textContent = "Error: " + error.message;
    }
}

testBtn.addEventListener("click", testConnection);
personForm.addEventListener("submit", addPerson);
showPeopleBtn.addEventListener("click", showPeople);
