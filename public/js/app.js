/*
app.js is used for the website Homepage (index.html)
*/
//****************************************************************************************** */

document.addEventListener("DOMContentLoaded", () => {
  /*************************
   * Home Main Product Grid (Universal JavaScript file)
   ************************/
  // Loads four products from the JSON file to display them in a grid layout
  fetch("/api/products")
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
          const link = `product.html?id=${product.sys.id}`; // Example: product.html[#]1
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
        shopMore.href = `${categoryFile}.html`; // Sets the links destination
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
