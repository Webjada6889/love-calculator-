let token = "";

// REGISTER
async function register() {
    await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    });

    alert("Registered ❤️");
}

// LOGIN
async function login() {
    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    });

    const data = await res.json();
    token = data.token;

    alert("Login successful 🔐");
}

// CALCULATE
async function calculate() {
    document.getElementById("sound").play();

    const res = await fetch("http://localhost:3000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name1: name1.value,
            name2: name2.value,
            token
        })
    });

    const data = await res.json();

    document.getElementById("result").innerHTML =
        `💖 ${data.score}% Love Match`;
}