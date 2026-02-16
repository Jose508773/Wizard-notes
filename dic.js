const googleBtn = document.getElementById("google-login-btn");
if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
        const { data, error } = await db.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin + "/dic.html",
                queryParams: {
                    prompt: "select_account"
                }
            }
        });
        if (error) alert("Sign-in failed: " + error.message);
    });
}

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const word = document.getElementById("word").value;
    const definition = document.getElementById("word-def").value;

    const { data, error } = await db
        .from("dictionary")
        .insert([{ word, definition }]);

    if (error) {
        document.getElementById("word-result").textContent = "Error: " + error.message;
    } else {
        document.getElementById("word-result").textContent = "✓ Added!";
        document.getElementById("word").value = "";
        document.getElementById("word-def").value = "";
    }
});


const getWordsBtn = document.getElementById("get-words-btn");
if (getWordsBtn) {
    getWordsBtn.addEventListener("click", async () => {
        const { data, error } = await db
            //supabase checks jwt from browser sent gets the uuid and only returnd row that matces uuid

            .from("dictionary")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            document.getElementById("words-result").textContent = "Error: " + error.message;
        } else {
            const list = document.getElementById("words-result");
            list.innerHTML = ""; // clear previous

            data.forEach(item => {
                const p = document.createElement("p");
                p.textContent = `${item.word}: ${item.definition}`;
                list.appendChild(p);
            });
        }
    });
}
