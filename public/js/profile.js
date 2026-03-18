/*
Author: Antonio Corona
Last Updated: 2026-03-18

This file updates the current information of the user

Updates login-settings user information
profile.jsd
*/

import { API_ENDPOINTS, PAGE_ROUTES } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = Auth.getUser();
  const isLoggedIn = Auth.isLoggedIn();

  if (!isLoggedIn || !user) {
    Auth.requireLogin("Please login to manage your login & security settings");
    return;
  }

  /*********************
   * LOGIN-SETTINGS PAGE
   *********************/

  const NAME_SUBTITLE = document.getElementById("NAME_SUBTITLE");
  const USERNAME_SUBTITLE = document.getElementById("USERNAME_SUBTITLE");
  const PASSWORD_SUBTITLE = document.getElementById("PASSWORD_SUBTITLE");
  const EMAIL_SUBTITLE = document.getElementById("EMAIL_SUBTITLE");
  const MOBILE_NUMBER_SUBTITLE = document.getElementById(
    "MOBILE_NUMBER_SUBTITLE"
  );

  if (NAME_SUBTITLE) {
    NAME_SUBTITLE.textContent = `${user.firstName} ${user.lastName}`;
  }

  if (USERNAME_SUBTITLE) {
    USERNAME_SUBTITLE.textContent = `${user.username}`;
  }

  if (PASSWORD_SUBTITLE) {
    PASSWORD_SUBTITLE.textContent = "*********";
  }

  if (EMAIL_SUBTITLE) {
    EMAIL_SUBTITLE.textContent = user.email || "";
  }

  if (MOBILE_NUMBER_SUBTITLE) {
    MOBILE_NUMBER_SUBTITLE.textContent = user.phone || "+1 (111)111-1111";
  }

  /****************************
   * End of LOGIN-SETTINGS PAGE
   ****************************/

  /*************************************************
   * 2) PROFILE PAGE (edit single field dynamically)
   *************************************************/
  const NEW_FIELD_INPUT = document.getElementById("NEW_FIELD_SUBTITLE");

  // NEW_FIELD_SUBTITLE acts as a trigger so the rest of this code is only loaded when on a profile.html page -AC
  if (NEW_FIELD_INPUT) {
    const NEW_FIELD_SUMMARY = document.getElementById("NEW_FIELD_SUMMARY");
    const NEW_FIELD_TITLE = document.getElementById("NEW_FIELD_TITLE");
    const CHANGE_TITLE = document.getElementById("CHANGE_TITLE");
    const CHANGE_MINI_TITLE = document.getElementById("CHANGE_MINI_TITLE");
    const SAVE_CHANGES_BUTTON = document.getElementById("SAVE_CHANGES_BUTTON");

    // Backend route: POST /api/auth/update-profile
    const UPDATE_PROFILE_URL = API_ENDPOINTS.updateProfile;

    // Determine which field we're editing: name, email, or phone
    const params = new URLSearchParams(window.location.search);
    const field = params.get("field") || "name"; // default to name

    let titleText = "";
    let summaryText = "";
    let currentValue = "";
    let changeTitle = "";
    let changeMiniTitle = "";

    if (field === "email") {
      changeTitle = "Change your email";
      changeMiniTitle = "Change your email";
      titleText = "New email address";
      summaryText =
        "If you want to change the email address associated with your account, you may do so below. Be sure to click the <strong>Save Changes</strong> button when you are done.";
      currentValue = user.email || "";
    } else if (field === "password") {
      changeTitle = "Change your password";
      changeMiniTitle = "Change your password";
      titleText = "New password";
      summaryText =
        "If you want to change the password associated with your account, you may do so below. Be sure to click the <strong>Save Changes</strong> button when you are done.";
      currentValue = "";
    } else if (field === "phone") {
      changeTitle = "Change your phone";
      changeMiniTitle = "Change your phone";
      titleText = "New phone number";
      summaryText =
        "If you want to change the phone number associated with your account, you may do so below. Be sure to click the <strong>Save Changes</strong> button when you are done.";
      currentValue = user.phone || "";
    } else if (field === "username") {
      changeTitle = "Change your username";
      changeMiniTitle = "Change your username";
      titleText = "New username number";
      summaryText =
        "If you want to change the username associated with your account, you may do so below. Be sure to click the <strong>Save Changes</strong> button when you are done.";
      currentValue = user.username || "";
    } else {
      // default: name
      changeTitle = "Change your name";
      changeMiniTitle = "Change your name";
      titleText = "New name";
      summaryText =
        "If you want to change the name associated with your account, you may do so below. Be sure to click the <strong>Save Changes</strong> button when you are done.";
      currentValue = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }

    if (CHANGE_TITLE) {
      CHANGE_TITLE.textContent = changeTitle;
    }

    if (CHANGE_MINI_TITLE) {
      CHANGE_MINI_TITLE.textContent = changeMiniTitle;
    }

    if (NEW_FIELD_TITLE) {
      NEW_FIELD_TITLE.textContent = titleText;
    }

    if (NEW_FIELD_SUMMARY) {
      // Includes <strong> tags, so use innerHTML
      NEW_FIELD_SUMMARY.innerHTML = summaryText;
    }

    // Important: inputs use .value, not .textContent
    NEW_FIELD_INPUT.value = currentValue;

    /*******************************************
     * SAVE CHANGES BUTTON -> PUT /api/auth/me
     *******************************************/
    if (SAVE_CHANGES_BUTTON) {
      SAVE_CHANGES_BUTTON.style.cursor = "pointer";

      let isSaving = false;

      SAVE_CHANGES_BUTTON.addEventListener("click", async () => {
        if (isSaving) return; // prevent double-click spam
        const newValue = NEW_FIELD_INPUT.value.trim();

        if (!newValue) {
          alert("Please enter a value before saving.");
          return;
        }

        const payload = {};

        if (field === "email") {
          payload.email = newValue;
        } else if (field === "phone") {
          payload.phone = newValue;
        } else if (field === "username") {
          payload.username = newValue;
        } else if (field === "password") {
          payload.password = newValue;
        } else {
          // field === "name"
          const parts = newValue.split(" ").filter(Boolean);
          if (parts.length === 0) {
            alert("Please enter a valid name.");
            return;
          }
          payload.firstName = parts[0];
          payload.lastName = parts.slice(1).join(" ") || "";
        }

        // Mimic register.js "submitting" style
        const buttonTextEl =
          SAVE_CHANGES_BUTTON.querySelector(".a-button-text");
        const originalText = buttonTextEl
          ? buttonTextEl.textContent
          : "Save Changes";

        try {
          isSaving = true;
          SAVE_CHANGES_BUTTON.classList.add("a-button-disabled");
          SAVE_CHANGES_BUTTON.style.pointerEvents = "none";
          if (buttonTextEl) buttonTextEl.textContent = "Saving...";

          const response = await fetch(UPDATE_PROFILE_URL, {
            method: "POST", // could be PUT
            headers: Auth.getAuthHeader(),
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to update profile");
          }

          // Update local user object in localStorage
          if (data.user) {
            Auth.setUser(data.user);
          }

          alert("Profile updated successfully!");

          // After saving, go back to Login & Security page
          window.location.href = PAGE_ROUTES.loginSettings;
        } catch (error) {
          console.error("Error updating profile:", error);
          alert(error.message || "Failed to update profile. Please try again.");
        } finally {
          isSaving = false;
          SAVE_CHANGES_BUTTON.classList.remove("a-button-disabled");
          SAVE_CHANGES_BUTTON.style.pointerEvents = "auto";
          if (buttonTextEl) buttonTextEl.textContent = originalText;
        }
      });
    }
  }
});
