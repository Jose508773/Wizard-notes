let btn = document.getElementById("hello-btn");
let result = document.getElementById("hello-result");


async function hello_greet() {
    let response = await fetch("api/hello");
    let data = await response.json();
    result.textContent = data.message;
}

btn.addEventListener("click", hello_greet);