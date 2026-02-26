document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("searchBar");
  const searchButton = document.getElementById("searchbutton");

  // Function to perform search
  function performSearch() {
    const query = searchBar.value.trim().toLowerCase();

    if (!query) {
      alert("Please enter a search term");
      return;
    }

    // Fetch products and filter
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const results = data.items.filter((item) => {
          const title = item.fields.title.toLowerCase();
          return title.includes(query);
        });

        // Check if we're on the home page or category page
        const mainGrid = document.querySelector(".main-grid");
        const categoryGrid = document.getElementById("category-grid");

        if (mainGrid) {
          // HOME PAGE - Clear all product grids and show search results
          displaySearchResultsOnHomePage(results, query, mainGrid);
        } else if (categoryGrid) {
          // CATEGORY PAGE - Use the existing category grid
          displaySearchResultsOnCategoryPage(results, query, categoryGrid);
        } else {
          alert("Search is not available on this page");
        }
      })
      .catch((err) => {
        console.error("Search failed:", err);
        alert("Search failed. Please try again.");
      });
  }

  // Display search results on HOME page
  function displaySearchResultsOnHomePage(results, query, mainGrid) {
    // Update the page title (same as category pages)
    const pageTitle = document.querySelector(".page-title h2");
    if (pageTitle) {
      pageTitle.textContent = `Search Results for "${query}"`;
    }

    // Hide the main-grid instead of clearing it
    mainGrid.style.display = "none";

    // Check if search results grid already exists
    let resultsGrid = document.getElementById("search-results-grid");

    if (!resultsGrid) {
      // Create a new category-grid as a SIBLING (not child) of main-grid
      resultsGrid = document.createElement("div");
      resultsGrid.classList.add("category-grid");
      resultsGrid.id = "search-results-grid";

      // Insert it after main-grid (as a sibling)
      mainGrid.parentNode.insertBefore(resultsGrid, mainGrid.nextSibling);
    } else {
      // Clear existing results if grid already exists
      resultsGrid.innerHTML = "";
      resultsGrid.style.display = "grid"; // Make sure it's visible
    }

    if (results.length === 0) {
      resultsGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: white;">No products found for "${query}". <a href="index.html" style="color: #28a99e; text-decoration: underline;">Go back to home</a></p>`;
    } else {
      // Display each result
      results.forEach((product) => {
        const card = createProductCard(product);
        resultsGrid.appendChild(card);
      });

      // Update button states after all cards are created
      if (typeof updateAddToCartButtons === "function") {
        updateAddToCartButtons();
      }
    }
  }
  // Display search results on CATEGORY page
  function displaySearchResultsOnCategoryPage(results, query, categoryGrid) {
    // Clear the current grid
    categoryGrid.innerHTML = "";

    // Update page title if it exists
    const pageTitle = document.querySelector(".page-title h2");
    if (pageTitle) {
      pageTitle.textContent = `Search Results for "${query}"`;
    }

    // Display results or "no results" message
    if (results.length === 0) {
      categoryGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: white;">No products found for "${query}". <a href="#" onclick="location.reload()" style="color: #28a99e; text-decoration: underline;">Clear search</a></p>`;
      return;
    }

    // Display each result
    results.forEach((product) => {
      const card = createProductCard(product);
      categoryGrid.appendChild(card);
    });

    // Update button states after all cards are created
    if (typeof updateAddToCartButtons === "function") {
      updateAddToCartButtons();
    }
  }

  // Helper function to create a product card
  function createProductCard(product) {
    const card = document.createElement("div");
    card.classList.add("category-card");

    const link = document.createElement("a");
    link.href = `product.html?id=${product.sys.id}`;
    link.classList.add("product-link");

    const img = document.createElement("img");
    img.src = product.fields.image.fields.file.url;
    img.alt = product.fields.title;
    img.classList.add("product-portrait");

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

    infoDiv.appendChild(title);
    infoDiv.appendChild(price);
    infoDiv.appendChild(description);
    infoDiv.appendChild(stock);

    link.appendChild(img);
    link.appendChild(infoDiv);

    // Creates the "Add to Cart" button
    const addToCartBtn = document.createElement("button");
    addToCartBtn.textContent = "Add to Cart";
    addToCartBtn.classList.add("add-to-cart");
    addToCartBtn.dataset.productId = product.sys.id;
    addToCartBtn.dataset.productData = JSON.stringify({
      id: product.sys.id,
      title: product.fields.title,
      image: product.fields.image.fields.file.url,
      price: product.fields.price.toFixed(2),
      description: product.fields.description,
      stock: product.fields.stock,
    });

    // Creates the "Buy Now" button
    const buyNowBtn = document.createElement("button");
    buyNowBtn.textContent = "Buy Now";
    buyNowBtn.classList.add("buy-now");

    // NO addEventListener here - cart.js handles it!

    card.appendChild(link);

    // CREATE button container (like in category.js)
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.appendChild(addToCartBtn);
    buttonContainer.appendChild(buyNowBtn);
    card.appendChild(buttonContainer);

    return card;
  }

  // Search when clicking the icon
  if (searchButton) {
    searchButton.addEventListener("click", performSearch);
  }

  // Search when pressing Enter in the search bar
  if (searchBar) {
    searchBar.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performSearch();
      }
    });
  }
});
