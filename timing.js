let btn = document.getElementById("time-btn");
let result = document.getElementById("time-result");

let nameInput = document.getElementById("name-input");
let ageInput = document.getElementById("age-input");
let nameResult = document.getElementById("name-result");
let ageResult = document.getElementById("age-result");
let peopleResult = document.getElementById("people-result");
let showPeopleBtn = document.getElementById("show-people-btn");




async function add_person() {
    let name = nameInput.value;
    let age = ageInput.value;
    let response = await fetch("api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: name, userAge: age })
    })

    let data = await response.json();
    peopleResult.textContent = data.people;
}



async function get_time() {
    let response = await fetch("api/test");

    let data = await response.json();
    result.textContent = data.response;
}


btn.addEventListener("click", get_time);