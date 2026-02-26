/*
login.js - Handles login form submission
*/
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitButton = loginForm.querySelector('input[type="submit"]');
      const originalButtonText = submitButton.value;
      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.value = "Logging in...";
      try {
        const username = document.getElementById("myUsername").value;
        const password = document.getElementById("myPassword").value;
        const response = await fetch(
          "https://c2s73c-3010.csb.app/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          }
        );
        const data = await response.json();
        console.log("LOGIN RESPONSE USER:", data.user);

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }
        // Save token and user data
        Auth.setToken(data.token);
        Auth.setUser(data.user);
        // Check if there's a redirect path
        const redirectPath = sessionStorage.getItem("redirectAfterLogin");
        sessionStorage.removeItem("redirectAfterLogin");
        // Show success message briefly
        submitButton.value = "Success! Redirecting...";
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = redirectPath || "index.html";
        }, 500);
      } catch (error) {
        alert(error.message || "Login failed. Please try again.");
        submitButton.disabled = false;
        submitButton.value = originalButtonText;
      }
    });
  }
});
