const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const fullname = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("/register", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                fullname: fullname,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {

            alert(data.message);

            window.location.href = "login.html";

        } else {

            alert(data.message || "Registration failed");

        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

    }

});