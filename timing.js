let btn = document.getElementById("time-btn");
let result = document.getElementById("time-result");











async function get_time() {
    let response = await fetch("api/test");

    let data = await response.json();
    result.textContent = data.response;
}

btn.addEventListener("click", get_time);