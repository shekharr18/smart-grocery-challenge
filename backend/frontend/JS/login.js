// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            const response = await fetch("/login", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {

                alert("Login Successful!");

                // Save user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                // Go to home page
              window.location.href = "/HTML/dashboard.html";

            } else {

                alert(data.message);
            }

        } catch (error) {

            console.error(error);

            alert("Cannot connect to server.");
        }

    });

}


// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

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

            if (data.success) {

                alert("Registration Successful!");

                window.location.href = "/HTML/login.html";

            } else {

                alert(data.message);
            }

        } catch (error) {

            console.error(error);

            alert("Cannot connect to server.");
        }

    });

}