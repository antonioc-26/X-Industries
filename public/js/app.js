/*
------------------------------------------------------------
Author: Antonio Corona
Last Updated: 2026-03-19
Project: X-Industries
File: app.js

Description:
  Handles logic for the homepage, including loading featured
  products and managing category navigation.

Responsibilities:
  - Fetch and display featured products
  - Generate product cards dynamically
  - Handle category-based navigation links
  - Connect UI components to backend product data
------------------------------------------------------------
*/

import { API_ENDPOINTS, PAGE_ROUTES } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  /*************************
   * Home Main Product Grid (Universal JavaScript file)
   ************************/
  // Loads four products from the JSON file to display them in a grid layout
  fetch(API_ENDPOINTS.products)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load product data");
      return response.json();
    })
    .then((data) => {
      const categories = [
        "Books",
        "Movies",
        "Electronics",
        "Video Games",
        "Toys",
        "Miscellaneous",
      ];

      categories.forEach((category) => {
        const grid = document.getElementById(`product-grid-${category}`); // FIXED: Added parentheses
        if (!grid) return;

        // This filter for products of the corresponding category and takes the first 4 from the json file
        const categoryProducts = data.items
          .filter((item) => item.fields.category === category)
          .slice(0, 4);

        categoryProducts.forEach((product) => {
          const title = product.fields.title;
          const image = product.fields.image.fields.file.url;
          const link = `${PAGE_ROUTES.product}?id=${product.sys.id}`; // Example: product.html[#]1
          const card = document.createElement("div");
          card.classList.add("product-card");
          card.innerHTML = `
                  <a href="${link}" class="product-link">
                    <img src="${image}" alt="${title}" class="product-image">
                    <h3 class="product-title">${title}</h3>
                  </a>
                `;
          grid.appendChild(card);
        });

        // This section adds the "Shop more" link below the 2x2 grid
        const shopMore = document.createElement("a"); // Creates dynamically a new html element <a> to be filled in later (the link).
        let categoryFile;
        if (category === "Miscellaneous") {
          categoryFile = "misc";
        } else {
          categoryFile = category.toLowerCase().replace(/\s+/g, "-");
        }

        // Sets the links destination
        if (categoryFile === "books") {
          shopMore.href = PAGE_ROUTES.books;
        } else if (categoryFile === "movies") {
          shopMore.href = PAGE_ROUTES.movies;
        } else if (categoryFile === "electronics") {
          shopMore.href = PAGE_ROUTES.electronics;
        } else if (categoryFile === "video-games") {
          shopMore.href = PAGE_ROUTES.videoGames;
        } else if (categoryFile === "toys") {
          shopMore.href = PAGE_ROUTES.toys;
        } else if (categoryFile === "misc") {
          shopMore.href = PAGE_ROUTES.misc;
        } 

        shopMore.textContent = `Shop more ${category}`; // Sets the visible part of the link dynamically to the category
        shopMore.classList.add("shop-more-link"); // Links the link to a css class to the <a> element which allows for styling.
        // Append after all product cards
        grid.appendChild(shopMore); // Gets appended underneath the 2x2 grid.
      });
    })
    // For testing purposes to see if its loading correctly
    .catch((error) => {
      console.error("Error loading products:", error);
      document.querySelectorAll(".product-grid").forEach((grid) => {
        grid.innerHTML = `<p>Failed to load products. Please try again later.</p>`;
      });
    });
});
/********************************
 * End Of Home Main Product Grid
 *******************************/
