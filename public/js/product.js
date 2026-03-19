/*
------------------------------------------------------------
Author: Antonio Corona
Last Updated: 2026-03-19
Project: X-Industries
File: product.js

Description:
  Manages the product detail page, displaying full information
  for a selected product.

Responsibilities:
  - Retrieve product ID from URL query parameters
  - Fetch product data from backend API
  - Render product details (title, price, description, etc.)
  - Handle Add to Cart and Buy Now interactions
------------------------------------------------------------
*/

import { API_ENDPOINTS, PAGE_ROUTES } from "./config.js";

// Allows for the html to fully load before the java script runs
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("product-container"); // Basic container for the product details
  // Uses the URL query to get the productId and by assosiation the parameters from the json file
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  // If product.html is accessed directly the code will not run.
  if (!productId) {
    container.innerHTML = "<p>No product specified.</p>";
    return;
  }
  // Obtains the data from the JSON file and get the specific product's info
  fetch(API_ENDPOINTS.products)
    .then((response) => response.json())
    .then((data) => {
      const product = data.items.find((item) => item.sys.id === productId);
      // If no product is found it throws an error message
      if (!product) {
        container.innerHTML = "<p>Product not found.</p>";
        return;
      }
      const f = product.fields; // converts the json field variable to f variable

      // Title ABOVE the two-column layout (centered)
      let html = `<h1 class="product-title-main" style="text-align: center;">${
        f.title || "No title"
      }</h1>`;

      // Build the two-column layout structure
      html += `<div class="product-two-column">`;

      // LEFT COLUMN: Image only
      html += `<div class="product-left-column">`;

      if (
        f.image &&
        f.image.fields &&
        f.image.fields.file &&
        f.image.fields.file.url
      ) {
        html += `<div class="product-image-container">
              <img src="${f.image.fields.file.url}" alt="${f.title}" class="product-image">
            </div>`;
      }
      html += `</div>`; // Close left column

      // RIGHT COLUMN: Description header and all details
      html += `<div class="product-right-column">`;
      html += `<h2 class="product-description-header">Description</h2>`;

      // Description text
      if (f.description) {
        html += `<p class="product-description-text">${f.description}</p>`;
      }

      // All other details
      if (f.price !== undefined) {
        html += `<p>Price: $${f.price.toFixed(2)}</p>`;
      }

      if (f.stock !== undefined) {
        html += `<p>Stock: ${f.stock} available</p>`;
      }

      if (f.category) {
        html += `<p>Category: ${f.category}</p>`;
      }

      if (f.rating !== undefined) {
        html += `<p>Rating: ${f.rating} / 5.0</p>`;
      }

      if (f.brand) {
        html += `<p>Brand: ${f.brand}</p>`;
      }

      // Handle nested details object
      if (f.details) {
        html += `<p><strong>Details:</strong></p>`;
        for (const [key, value] of Object.entries(f.details)) {
          // Convert camelCase to readable format
          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
          html += `<p>${formattedKey}: ${value}</p>`;
        }
      }

      html += `</div>`; // Close right column
      html += `</div>`; // Close two-column container

      // Button container OUTSIDE and BELOW the two-column layout
      html += `<div class="product-button-container"></div>`;

      container.innerHTML = html;

      // Add stock badge if out of stock or low stock
      if (f.stock !== undefined) {
        const imageContainer = container.querySelector(
          ".product-image-container"
        );
        if (imageContainer) {
          const badge = document.createElement("div");
          badge.classList.add("stock-badge");
          badge.style.position = "absolute";
          badge.style.top = "75px";
          badge.style.right = "0";

          if (f.stock === 0) {
            badge.textContent = "Out of Stock";
            badge.classList.add("out-of-stock");
          } else if (f.stock <= 3) {
            badge.textContent = `Only ${f.stock} left`;
            badge.classList.add("low-stock");
          }

          // Only append badge if it has content
          if (badge.textContent) {
            // Make the image container relative so badge positions correctly
            imageContainer.style.position = "relative";
            imageContainer.appendChild(badge);
          }
        }
      }

      // Get the button container
      const buttonContainer = container.querySelector(
        ".product-button-container"
      );

      // Product data object
      const productData = {
        id: product.sys.id,
        title: f.title,
        image: f.image.fields.file.url,
        price: f.price.toFixed(2),
        description: f.description,
        stock: f.stock,
      };

      // Creates the "Buy Now" button
      // Creates the "Add to Cart" button
      const addToCartBtn = document.createElement("button");
      addToCartBtn.textContent = "Add to Cart";
      addToCartBtn.classList.add("add-to-cart-product");
      addToCartBtn.dataset.productId = product.sys.id;
      addToCartBtn.dataset.productData = JSON.stringify(productData);

      // Check if out of stock
      if (f.stock === 0) {
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = "Out of Stock";
      }

      buttonContainer.appendChild(addToCartBtn);

      // Creates the "Buy Now" button
      const buyNowBtn = document.createElement("button");
      buyNowBtn.textContent = "Buy Now";
      buyNowBtn.classList.add("buy-now-product");

      // Disable button if out of stock
      if (f.stock === 0) {
        buyNowBtn.disabled = true;
      }

      buyNowBtn.addEventListener("click", function () {
        // Create shadow cart with this single item
        const shadowCart = [
          {
            ...productData,
            quantity: 1,
          },
        ];

        // Store in sessionStorage
        sessionStorage.setItem("shadowCart", JSON.stringify(shadowCart));
        sessionStorage.setItem("buyNowMode", "true");
        // Redirect to buynow.html
        window.location.href = PAGE_ROUTES.buyNow;
      });

      buttonContainer.appendChild(buyNowBtn);

      // Let cart.js handle the state
      if (typeof updateAddToCartButtons === "function") {
        updateAddToCartButtons();
      }
    })
    // Simple error catcher for erros fetching the JSON file with a message.
    .catch((error) => {
      console.error(error);
      container.innerHTML = "<p>Failed to load product data.</p>";
    });
});
