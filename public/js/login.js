/*
Author: Antonio Corona
Last Updated: 2026-03-18

login.js - Handles login form submission
*/

import { API_ENDPOINTS, PAGE_ROUTES } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = loginForm.querySelector('input[type="submit"]');
      const originalButtonText = submitButton.value;

      submitButton.disabled = true;
      submitButton.value = "Logging in...";

      try {
        const username = document.getElementById("myUsername").value.trim();
        const password = document.getElementById("myPassword").value;

        const response = await fetch(API_ENDPOINTS.login, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        Auth.setToken(data.token);
        Auth.setUser(data.user);

        const redirectPath = sessionStorage.getItem("redirectAfterLogin");
        sessionStorage.removeItem("redirectAfterLogin");

        submitButton.value = "Success! Redirecting...";

        setTimeout(() => {
          window.location.href = redirectPath || PAGE_ROUTES.home;
        }, 500);
      } catch (error) {
        console.error("Login error:", error);
        alert(error.message || "Login failed. Please try again.");
        submitButton.disabled = false;
        submitButton.value = originalButtonText;
      }
    });
  }
});