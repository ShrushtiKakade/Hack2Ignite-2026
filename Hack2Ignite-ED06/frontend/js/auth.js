const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        message.textContent = "Logging in...";

        try {

            const result = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            localStorage.setItem("user", JSON.stringify(result));

            if (result.role === "STUDENT") {
                window.location.href = "student/dashboard.html";
            }
            else if (result.role === "MENTOR") {
                window.location.href = "mentor/dashboard.html";
            }
            else if (result.role === "ADMIN") {
                window.location.href = "admin/dashboard.html";
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Login failed. Please check your email and password.";
        }
    });
}