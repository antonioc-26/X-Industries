/*
------------------------------------------------------------
Author: Antonio Corona
Last Updated: 2026-03-19
Project: X-Industries
File: category.js

Description:
  Handles product rendering for category pages such as Books,
  Movies, Electronics, etc.

Responsibilities:
  - Detect current category from page context
  - Fetch category-specific products from backend
  - Dynamically render product cards
  - Link each product to its detail page
------------------------------------------------------------
*/

import { API_ENDPOINTS, PAGE_ROUTES } from "./config.js";

// Allows for the html to fully load before the java script runs
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("category-grid");
  if (!grid) return;
  // Grab the category from the HTML
  const categoryName = grid.dataset.category;
  // Fetches product data from JSON file
  fetch(API_ENDPOINTS.products)
    .then((res) => res.json())
    .then((data) => {
      // filters for only items in the designated category
      const products = data.items.filter(
        (item) => item.fields.category === categoryName
      );
      // Loops through each product in the category and creates cards for them.
      products.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("category-card");
        card.style.position = "relative"; // Make card the positioning parent

        // Get stock value early
        const stockValue = product.fields.stock;

        const link = document.createElement("a");
        link.href = `${PAGE_ROUTES.product}?id=${product.sys.id}`;
        link.classList.add("product-link");

        // Create wrapper div that will be greyed out
        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("category-card-content");

        // Add out-of-stock class to wrapper if stock is 0
        if (stockValue === 0) {
          contentWrapper.classList.add("out-of-stock-content");
        }

        // Create image container for badge positioning
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("category-image-wrapper");

        const img = document.createElement("img");
        img.src = product.fields.image.fields.file.url;
        img.alt = product.fields.title;
        img.classList.add("product-portrait");

        imgContainer.appendChild(img);

        // Info section of the title and price.
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("product-info");
        const title = document.createElement("h3");
        title.textContent = product.fields.title;
        const price = document.createElement("p");
        price.textContent = `$${product.fields.price.toFixed(2)}`;
        const description = document.createElement("p");
        description.textContent = product.fields.description || "";
        const stock = document.createElement("p");
        stock.textContent =
          product.fields.stock !== undefined
            ? `In stock: ${product.fields.stock}`
            : "";
        // Assemble the info div
        infoDiv.appendChild(title);
        infoDiv.appendChild(price);
        infoDiv.appendChild(description);
        infoDiv.appendChild(stock);
        // Assemble the link
        link.appendChild(imgContainer);
        link.appendChild(infoDiv);

        // Add link to content wrapper
        contentWrapper.appendChild(link);

        // Product data object
        const productData = {
          id: product.sys.id,
          title: product.fields.title,
          image: product.fields.image.fields.file.url,
          price: product.fields.price.toFixed(2),
          description: product.fields.description,
          stock: product.fields.stock,
        };

        // Creates the "Add to Cart" button
        const addToCartBtn = document.createElement("button");
        addToCartBtn.textContent = "Add to Cart";
        //do not change the "add-to-cart" classList line. it controls category css
        addToCartBtn.classList.add("add-to-cart");
        addToCartBtn.dataset.productId = product.sys.id;
        addToCartBtn.dataset.productData = JSON.stringify(productData);

        // Disable button if out of stock
        if (stockValue === 0) {
          addToCartBtn.disabled = true;
          addToCartBtn.textContent = "Out of Stock";
        }

        // Creates the "Buy Now" button
        const buyNowBtn = document.createElement("button");
        buyNowBtn.textContent = "Buy Now";
        //do not change the "buy-now" classList line.
        buyNowBtn.classList.add("buy-now");

        // Disable button if out of stock
        if (stockValue === 0) {
          buyNowBtn.disabled = true;
        }

        // Redirect on click with shadow cart
        buyNowBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

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

        // CREATE button container
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");
        buttonContainer.appendChild(addToCartBtn);
        buttonContainer.appendChild(buyNowBtn);
        contentWrapper.appendChild(buttonContainer);

        // Assemble the card - add content wrapper first
        card.appendChild(contentWrapper);

        // Create stock badge AFTER content wrapper, directly on card
        if (stockValue !== undefined) {
          const badge = document.createElement("div");
          badge.classList.add("stock-badge");

          if (stockValue === 0) {
            badge.textContent = "Out of Stock";
            badge.classList.add("out-of-stock");
          } else if (stockValue <= 3) {
            badge.textContent = `Only ${stockValue} left`;
            badge.classList.add("low-stock");
          }

          // Only append badge if it has content - append directly to card
          if (badge.textContent) {
            card.appendChild(badge);
          }
        }

        grid.appendChild(card);
      });

      // Update all button states after creating them
      if (typeof updateAddToCartButtons === "function") {
        updateAddToCartButtons();
      }
    })
    // catches any errors dealing with problems loading the products.
    .catch((err) => {
      console.error("Failed to load category products:", err);
      grid.innerHTML = "<p>Failed to load products.</p>";
    });
});
