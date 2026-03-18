/*
Author: Antonio Corona
Last Updated: 2026-03-18

register.js - Handles registration form submission
Include this in account.html: <script src="register.js"></script>
*/

import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = registerForm.querySelector('input[type="submit"]');
      const originalButtonText = submitButton.value;

      submitButton.disabled = true;
      submitButton.value = "Creating Account...";

      try {
        const firstName = document.getElementById("myfName").value.trim();
        const lastName = document.getElementById("mylName").value.trim();
        const username = document.getElementById("myUsername").value.trim();
        const email = document.getElementById("myEmail").value.trim();
        const phone = document.getElementById("myPhone").value.trim();
        const password = document.getElementById("myPassword").value;

        const response = await fetch(`${API_URL}/auth/register`, {
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
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        Auth.setToken(data.token);
        Auth.setUser(data.user);

        submitButton.value = "Success! Redirecting...";

        setTimeout(() => {
          window.location.href = "index.html";
        }, 500);
      } catch (error) {
        console.error("Registration error:", error);
        alert(error.message || "Registration failed. Please try again.");
        submitButton.disabled = false;
        submitButton.value = originalButtonText;
      }
    });
  }
});
