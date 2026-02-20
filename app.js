let btn = document.getElementById("hello-btn");
let result = document.getElementById("hello-result");


async function hello_greet() {
    let response = await fetch("api/hello");
    let data = await response.json();
    result.textContent = data.message;
}

btn.addEventListener("click", hello_greet);

let nameBtn = document.getElementById("name-btn");
let nameInput = document.getElementById("name-input");
let nameResult = document.getElementById("name-result");

function sayName(name) {
    nameResult.textContent = "Hello " + name;
}
nameBtn.addEventListener("click", () => sayName(nameInput.value));