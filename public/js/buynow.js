/*
------------------------------------------------------------
Author: Antonio Corona
Last Updated: 2026-03-19
Project: X-Industries
File: buynow.js

Description:
  Handles the checkout and order placement process for users.

Responsibilities:
  - Load cart or shadow cart data for checkout
  - Collect user shipping and payment information
  - Send order data to backend API
  - Display confirmation upon successful order placement
------------------------------------------------------------
*/

import { API_ENDPOINTS, PAGE_ROUTES } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  // CHECK IF USER IS LOGGED IN - If not, redirect
  if (!Auth.isLoggedIn()) {
    Auth.requireLogin();
    return;
  }

  // Get shadow cart from sessionStorage
  const shadowCart = JSON.parse(sessionStorage.getItem("shadowCart")) || [];
  const shadowCartItems = document.getElementById("shadow-cart-items");
  const shadowCartCount = document.getElementById("shadow-cart-count");
  const shadowSubtotal = document.getElementById("shadow-subtotal");
  const shadowTotal = document.getElementById("shadow-total");

  // If shadow cart is empty, redirect back to cart
  if (shadowCart.length === 0) {
    shadowCartItems.innerHTML = "<p>No items to checkout. Redirecting...</p>";
    setTimeout(() => {
      window.location.href = PAGE_ROUTES.cart;
    }, 2000);
    return;
  }

  // Display shadow cart items
  shadowCart.forEach((product) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("shadow-cart-item");
    itemDiv.innerHTML = `
            <div class="shadow-item-content">
              <img src="${product.image}" alt="${product.title}">
              <div class="shadow-item-details">
                <h4>${product.title}</h4>
                <p class="shadow-item-description">${
                  product.description || ""
                }</p> <!-- NEW AC -->
                <p>Price: $${parseFloat(product.price).toFixed(2)}</p>
                <p>Quantity: ${product.quantity}</p>
                <p class="item-total">Item Total: $${(
                  parseFloat(product.price) * product.quantity
                ).toFixed(2)}</p>
              </div>
            </div>
          `;
    shadowCartItems.appendChild(itemDiv);
  });

  // Calculate totals
  const itemCount = shadowCart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = shadowCart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  // Update display
  shadowCartCount.textContent = itemCount;
  shadowSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  shadowTotal.textContent = `$${subtotal.toFixed(2)}`;

  // Handle form submission
  const checkoutForm = document.getElementById("checkout-form");
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get submit button
    const submitButton = checkoutForm.querySelector('input[type="submit"]');
    const originalButtonText = submitButton.value;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.value = "Processing Order...";

    // Get customer info from form
    const formData = new FormData(checkoutForm);
    const customerInfo = {
      name: formData.get("myName"),
      address: formData.get("myAddress"),
      city: formData.get("myCity"),
      state: formData.get("myState"),
      zip: formData.get("myZip"),
      cardNumber: formData.get("myCC"),
      cardExpiry: formData.get("myExp"),
      cardCVV: formData.get("myCVV"),
    };

    // Prepare items for backend
    const orderItems = shadowCart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      description: item.description,
    }));

    try {
      // Call backend API to place order WITH AUTHENTICATION
      //VERY IMPORTANT for order placement to work

      const response = await fetch(
        //if port is changed, num here needs to change.
        API_ENDPOINTS.placeOrder,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Auth.getToken()}`,
          },
          body: JSON.stringify({
            items: orderItems,
            customerInfo: customerInfo,
          }),
        }
      );

      const result = await response.json();

      // Check if authentication is needed
      if (result.needsLogin) {
        Auth.requireLogin();
        return;
      }

      if (response.ok && result.success) {
        // Clear shadow cart
        sessionStorage.removeItem("shadowCart");

        // Check if this was a "Buy Now" (single item) or "Place Order" (from cart)
        const isBuyNow = sessionStorage.getItem("buyNowMode") === "true";
        sessionStorage.removeItem("buyNowMode");

        // Only clear cart if placing order from cart page
        if (!isBuyNow) {
          localStorage.removeItem("cart");
          localStorage.setItem("cartCount", 0);
        }

        // Get user info for personalized message
        const user = Auth.getUser();

        // Create custom confirmation popup
        const confirmationOverlay = document.createElement("div");
        confirmationOverlay.style.cssText = `
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
      `;

        const confirmationPopup = document.createElement("div");
        confirmationPopup.style.cssText = `
        background-color: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        text-align: center;
        animation: slideIn 0.3s ease-out;
      `;

        confirmationPopup.innerHTML = `
        <div style="color: #27ae60; font-size: 48px; margin-bottom: 20px;">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2 style="color: #27ae60; margin: 0 0 10px 0;">Order Confirmed!</h2>
        <p style="font-size: 20px; font-weight: bold; margin: 10px 0;">
          Thanks, ${user.username}!
        </p>
        <p style="margin: 20px 0; font-size: 16px; color: #666;">
          Your order has been placed successfully.
        </p>
        <p style="font-size: 16px; margin: 10px 0;">
          <strong>Order ID:</strong> <span style="color: #2029c3;">${result.orderId}</span>
        </p>
        <button id="confirmOkBtn" style="
          background-color: #2029c3;
          color: white;
          border: none;
          padding: 12px 40px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
          transition: opacity 0.3s ease;
        ">Continue Shopping</button>
      `;

        // Add animation
        const style = document.createElement("style");
        style.textContent = `
        @keyframes slideIn {
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

        confirmationOverlay.appendChild(confirmationPopup);
        document.body.appendChild(confirmationOverlay);

        // Handle button click
        document
          .getElementById("confirmOkBtn")
          .addEventListener("click", () => {
            window.location.href = PAGE_ROUTES.home;
          });

        // Also allow clicking overlay to close (after 1 second delay)
        setTimeout(() => {
          confirmationOverlay.addEventListener("click", (e) => {
            if (e.target === confirmationOverlay) {
              window.location.href = PAGE_ROUTES.home;
            }
          });
        }, 1000);
      } else {
        throw new Error(result.error || "Order placement failed");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order: " + error.message);

      // Re-enable button
      submitButton.disabled = false;
      submitButton.value = originalButtonText;
    }
  });
});
