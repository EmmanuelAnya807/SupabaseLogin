const signUpButton = document.getElementById("sign_up_button")
const loginButton = document.getElementById("login_button")
const existingAcc = document.querySelector(".existing_acc")
const newAcc = document.querySelector(".new_acc")
const signUpMessage = document.querySelector(".Sign_up")
const loginMessage = document.querySelector(".Login")

const form = document.querySelector("form")
const submitButton = form.querySelector("button")

const AUTH_URL = "http://localhost:3000"
let currentMode = "login"


signUpButton.addEventListener("click", (e) => {
    e.preventDefault()
    currentMode = "signup"
    signUpMessage.classList.remove('hidden')
    loginMessage.classList.add('hidden')
    newAcc.classList.add('hidden')
    existingAcc.classList.remove('hidden')
    submitButton.innerText = "Create Account"
})

loginButton.addEventListener("click", (e) => {
    e.preventDefault()
    currentMode = "login"
    signUpMessage.classList.add('hidden')
    loginMessage.classList.remove('hidden')
    newAcc.classList.remove('hidden')
    existingAcc.classList.add('hidden')
    submitButton.innerText = "Login"
})

form.addEventListener("submit", async (e) => {
    e.preventDefault() // Stops form from refreshing the page
    if (currentMode === "signup") {
        await handleSignUp()
    } else {
        await handleLogin()
    }
})


// Handle signup
async function handleSignUp() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if (!email || !password) {
        alert("Please fill in both email and password!")
        return
    }

    try{
        const response = await fetch(`${AUTH_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        alert(data.message || data.error);

        // Optional: Auto switch to login view after successful signup
        if (response.ok) {
            loginButton.click() // Simulates clicking login link to reset layout
            }
    } catch (error) {
        alert("Failed to connect to the authentication server.")
    }
}

    

// 2. Handle Login & Save Token
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please fill in both email and password.');
        return;
    }
    try {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access_token', data.access_token);
            window.location.href = 'dashboard.html';
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert("Failed to connect to the authentication server.")
    }
}