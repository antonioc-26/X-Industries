/*
------------------------------------------------------------
Author: Antonio Corona
Last Updated: 2026-03-19
Project: X-Industries
File: register.js

Description:
  Handles new user account creation.

Responsibilities:
  - Capture registration form input
  - Send user data to backend API
  - Handle validation and error responses
  - Store token and log user in upon success
------------------------------------------------------------
*/

import { API_ENDPOINTS, PAGE_ROUTES } from "./config.js";

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

        const response = await fetch(API_ENDPOINTS.register, {
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
          window.location.href = PAGE_ROUTES.home;
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
