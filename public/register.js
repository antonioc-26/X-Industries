/*
register.js - Handles registration form submission
Include this in account.html: <script src="register.js"></script>
*/

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector(".account-form");

  if (registerForm && window.location.pathname.includes("account.html")) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = registerForm.querySelector('input[type="submit"]');
      const originalButtonText = submitButton.value;

      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.value = "Creating Account...";

      try {
        const firstName = document.getElementById("myfName").value;
        const lastName = document.getElementById("mylName").value;
        const username = document.querySelector(
          'input[name="myUsername"]'
        ).value;
        const email = document.getElementById("myEmail").value;
        const phone = document.getElementById("myPhone").value;
        const password = document.getElementById("myPassword").value;

        const response = await fetch(
          "https://c2s73c-3010.csb.app/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName,
              lastName,
              username,
              email,
              phone,
              password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        // Save token and user data
        Auth.setToken(data.token);
        Auth.setUser(data.user);

        // Show success message
        submitButton.value = "Success! Redirecting...";

        // Redirect after short delay
        setTimeout(() => {
          window.location.href = "index.html";
        }, 500);
      } catch (error) {
        alert(error.message || "Registration failed. Please try again.");
        submitButton.disabled = false;
        submitButton.value = originalButtonText;
      }
    });
  }
});
