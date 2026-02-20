// Helper to get the current user's access token from localStorage
// (Supabase stores the session here after OAuth login)
function getAuthHeaders() {
    const stored = localStorage.getItem("sb-whgqadoefuwoixylzdwt-auth-token");
    if (!stored) return {};
    const session = JSON.parse(stored);
    const token = session.access_token;
    if (!token) return {};
    return { "Authorization": "Bearer " + token };
}

// Fetch and display all words
async function loadWords() {
    const authHeaders = getAuthHeaders();
    const list = document.getElementById("words-result");
    try {
        const res = await fetch("/api/dictionary", { headers: authHeaders });
        const result = await res.json();

        if (result.error) {
            list.textContent = "Error: " + result.error;
        } else if (result.data.length === 0) {
            list.innerHTML = '<p class="empty-state">No words yet — add your first one above!</p>';
        } else {
            list.innerHTML = "";
            result.data.forEach(item => {
                const p = document.createElement("p");
                p.innerHTML = `<strong>${item.word}</strong> — ${item.definition}`;
                list.appendChild(p);
            });
        }
    } catch (err) {
        list.textContent = "Error: " + err.message;
    }
}

// Load words on page load
loadWords();

// Add word form
const form = document.querySelector("form");
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const word = document.getElementById("word").value;
        const definition = document.getElementById("word-def").value;
        const authHeaders = getAuthHeaders();

        try {
            const res = await fetch("/api/dictionary", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify({ word, definition })
            });
            const result = await res.json();

            if (result.error) {
                document.getElementById("word-result").textContent = "Error: " + result.error;
            } else {
                document.getElementById("word-result").textContent = "✓ Added!";
                document.getElementById("word").value = "";
                document.getElementById("word-def").value = "";
                // Reload the word list
                loadWords();
            }
        } catch (err) {
            document.getElementById("word-result").textContent = "Error: " + err.message;
        }
    });
}

// Refresh button
const getWordsBtn = document.getElementById("get-words-btn");
if (getWordsBtn) {
    getWordsBtn.addEventListener("click", loadWords);
}
