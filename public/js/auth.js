/*
Author: Antonio Corona
Last Updated: 2026-03-18

auth.js - Frontend authentication utilities
Handles token management, login state, and authentication checks
*/

import { API_URL } from "./config.js";

const Auth = {
  // Get token from localStorage
  getToken: () => localStorage.getItem("authToken"),

  // Set token in localStorage
  setToken: (token) => localStorage.setItem("authToken", token),

  // Remove token from localStorage
  removeToken: () => localStorage.removeItem("authToken"),

  // Get user from localStorage
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Set user in localStorage
  setUser: (user) => localStorage.setItem("user", JSON.stringify(user)),

  // Remove user from localStorage
  removeUser: () => localStorage.removeItem("user"),

  // Check if user is logged in
  isLoggedIn: () => !!Auth.getToken(),

  // Get authorization header
  getAuthHeader: () => ({
    Authorization: `Bearer ${Auth.getToken()}`,
    "Content-Type": "application/json",
  }),

  // Logout user
  logout: async () => {
    try {
      if (Auth.isLoggedIn()) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: Auth.getAuthHeader(),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Auth.removeToken();
      Auth.removeUser();
      window.location.href = "index.html";
    }
  },

  // Show login required popup and redirect
  requireLogin: (
    message = "Whoops! You must login before placing an order"
  ) => {
    sessionStorage.setItem("loginMessage", message);
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    window.location.href = "login.html";
    console.log("DEBUG - requireLogin called");
  },

  // Check if order placement should be blocked
  checkOrderPermission: () => {
    if (!Auth.isLoggedIn()) {
      Auth.requireLogin();
      return false;
    }
    return true;
  },
};

// Show login popup message
function showLoginPopup(message) {
  const popup = document.createElement("div");
  popup.className = "login-popup-overlay";
  popup.innerHTML = `
    <div class="login-popup-content">
      <span class="login-popup-close">&times;</span>
      <h2 style="color: #e74c3c; margin-top: 0;">Whoops!</h2>
      <p>${message}</p>
    </div>
  `;

  // Add styles
  if (!document.getElementById("loginPopupStyles")) {
    const style = document.createElement("style");
    style.id = "loginPopupStyles";
    style.textContent = `
      .login-popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
      }
      
      .login-popup-content {
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        position: relative;
        animation: slideDown 0.3s;
        text-align: center;
      }
      
      .login-popup-content p {
        margin: 20px 0;
        font-size: 16px;
        color: #333;
        line-height: 1.5;
      }
      
      .login-popup-close {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 28px;
        font-weight: bold;
        color: #aaa;
        cursor: pointer;
        transition: color 0.3s;
      }
      
      .login-popup-close:hover {
        color: #000;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideDown {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(popup);

  const closeBtn = popup.querySelector(".login-popup-close");
  closeBtn.onclick = () => popup.remove();
  popup.onclick = (e) => {
    if (e.target === popup) popup.remove();
  };

  setTimeout(() => {
    if (popup.parentNode) popup.remove();
  }, 5000);
}

// Check for login message on page load
document.addEventListener("DOMContentLoaded", () => {
  const loginMessage = sessionStorage.getItem("loginMessage");

  if (loginMessage && window.location.pathname.includes("login.html")) {
    showLoginPopup(loginMessage);
    sessionStorage.removeItem("loginMessage");
  }

  // Update UI based on auth status
  updateAuthUI();
});

// Update UI based on login status
function updateAuthUI() {
  const user = Auth.getUser();
  const isLoggedIn = Auth.isLoggedIn();

  const accountButton = document.getElementById("accountButton");
  const signOutButton = document.getElementById("signOutButton");

  function redirectToPage() {
    window.location.href = "dashboard.html";
  }

  if (isLoggedIn && user) {
    if (accountButton) {
      accountButton.textContent = `Hello, ${user.username}`;
      accountButton.onclick = (e) => {
        e.preventDefault();
        redirectToPage();
        //if (confirm("Do you want to logout?")) {
        //  Auth.logout();
        //}
      };
    }
  } else {
    if (accountButton) {
      accountButton.textContent = "Login";
    }
  }
  if (isLoggedIn && user) {
    if (signOutButton) {
      signOutButton.onclick = (e) => {
        e.preventDefault();
        if (confirm("Do you want to logout?")) {
          Auth.logout();
        }
      };
    }
  }
  if (isLoggedIn && user) {
    const USER_WELCOME_MESSAGE = document.getElementById("userWelcomeMessage");
    if (USER_WELCOME_MESSAGE) {
      USER_WELCOME_MESSAGE.textContent = `Welcome ${user.username}!`;
    }
  }
  // Updates login-settings user information
  /*

  if (isLoggedIn && user) {
    if (NAME_SUBTITLE) {
      NAME_SUBTITLE.textContent = `${user.firstName} ${user.lastName}`;
    }
    if (EMAIL_SUBTITLE) {
      EMAIL_SUBTITLE.textContent = `${user.email}`;
    
    if (MOBILE_NUMBER_SUBTITLE) {
      MOBILE_NUMBER_SUBTITLE.textContent = `${user.phone}`;
    }
    
  }*/
}

// Export for use in other scripts
window.Auth = Auth;
window.showLoginPopup = showLoginPopup;
