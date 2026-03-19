/*
cart.js is used for the website Cart (cart.html)
also used to manage the cart as a whole.
*/
//****************************************************************************************** */
document.addEventListener("DOMContentLoaded", () => {
  const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

  //update cart count on all pages
  const cartCountElement = document.getElementById("cart-count");

  function updateCartCount() {
    const count = currentCart.reduce((sum, item) => sum + item.quantity, 0);
    const total = currentCart.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    if (cartCountElement) cartCountElement.textContent = count;
    localStorage.setItem("cartCount", count);

    // Update cart total in header if element exists
    const cartTotalElement = document.getElementById("cart-total");
    if (cartTotalElement) {
      cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Update running total section in cart page if element exists
    const runningCartCountElement =
      document.getElementById("running-cart-count");
    const runningTotalElement = document.getElementById("running-total-amount");

    if (runningCartCountElement) runningCartCountElement.textContent = count;
    if (runningTotalElement)
      runningTotalElement.textContent = `$${total.toFixed(2)}`;
  }

  // Function to show stock error popup
  window.showStockErrorPopup = function () {
    // Create popup overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
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

    // Create popup box
    const popup = document.createElement("div");
    popup.style.cssText = `
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          text-align: center;
        `;

    popup.innerHTML = `
          <h2 style="color: #e74c3c; margin-top: 0;">Whoops!</h2>
          <p style="margin: 20px 0; font-size: 16px; line-height: 1.5;">
            You cannot add more to your cart than what is in stock. We're sorry!
          </p>
          <button id="closePopupBtn" style="
            background-color: #2029c3;
            color: white;
            border: none;
            padding: 10px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: opacity 0.3s ease;
          ">OK</button>
        `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Add hover effect to button
    const closeBtn = document.getElementById("closePopupBtn");
    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.opacity = "0.8";
    });
    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.opacity = "1";
    });

    // Close popup on button click
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    // Close popup on overlay click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  };

  updateCartCount();

  //only run this part in cart.html
  const cartList = document.getElementById("shopping-cart-list");
  if (cartList) {
    if (currentCart.length === 0) {
      cartList.innerHTML = `
          
          <p class="emptyp">Your cart is empty.</p>
          `;
      return;
    }

    currentCart.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("category-card");

      // Set up the product info
      card.innerHTML = `
          <div class="cart-item" style="display:flex; gap:15px; align-items:stretch;">
          <img src="${product.image}" alt="${
        product.title
      }" style="width:150px; height:250px; object-fit:cover;">
          
          <div class="cart-item-info" style="flex:1; padding:10px; display:flex; flex-direction:column; justify-content:center;">
            <h3 style="margin-top:0;">${product.title}</h3>
            <p>Item Price: $${parseFloat(product.price).toFixed(2)}</p>
            <p>Total Price: $${(
              parseFloat(product.price) * product.quantity
            ).toFixed(2)}</p>
            <p>Description: ${
              product.description || "No description available"
            }</p>
            <p>Stock: ${product.stock || "N/A"}</p>         
          </div>
    
          <div class="quantity-controls" style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:0 15px;">
            <i class="fas fa-chevron-up" onclick="increaseAmount('${
              product.id
            }')" style="cursor:pointer; font-size:24px; color:#2029c3;"></i>
            <p style="margin:0; font-size:18px; font-weight:bold;">${
              product.quantity
            }</p>
            <i class="fas fa-chevron-down" onclick="decreaseAmount('${
              product.id
            }')" style="cursor:pointer; font-size:24px; color:#2029c3;"></i>
          </div>
        </div>
          `;

      // Create and configure the "Remove from Cart" button
      const removeFromCartBtn = document.createElement("button");
      removeFromCartBtn.textContent = "Remove from Cart";
      removeFromCartBtn.classList.add("remove-from-cart");

      // Attach click handler
      removeFromCartBtn.addEventListener("click", () => {
        removeFromCart(product);
      });

      // Append the button to the card
      card.appendChild(removeFromCartBtn);

      // Add the card to the cart list
      cartList.appendChild(card);
    });
  }

  //addToCart available globally with stock validation
  window.addToCart = function (product) {
    const existing = currentCart.find((item) => item.id === product.id);
    const stockAmount = parseInt(product.stock) || 0;

    // Check stock availability
    if (existing) {
      // Check if adding one more would exceed stock
      if (existing.quantity >= stockAmount) {
        showStockErrorPopup();
        return;
      }
      existing.quantity += 1;
    } else {
      // Check if product has stock available for initial add
      if (stockAmount <= 0) {
        showStockErrorPopup();
        return;
      }
      currentCart.push({
        ...product,
        quantity: 1,
        description: product.description || "",
      });
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    updateCartCount();
    updateAddToCartButtons(); // Update button states after adding
  };

  window.removeFromCart = function (product) {
    const index = currentCart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      currentCart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(currentCart));
      updateCartCount();
      location.reload();
    }
  };
  // Clear cart function with styled popup
  window.clearCart = function () {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Show styled popup if cart is already empty
    if (currentCart.length === 0) {
      showEmptyCartPopup();
      return;
    }

    // Create confirmation overlay
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
      <div style="color: #e74c3c; font-size: 48px; margin-bottom: 20px;">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h2 style="color: #e74c3c; margin: 0 0 10px 0;">Clear Cart?</h2>
      <p style="margin: 20px 0; font-size: 16px; color: #666;">
        Are you sure you want to remove all items from your cart? This action cannot be undone.
      </p>
      <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
        <button id="cancelClearBtn" style="
          background-color: #95a5a6;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: opacity 0.3s ease;
        ">Cancel</button>
        <button id="confirmClearBtn" style="
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: opacity 0.3s ease;
        ">Clear Cart</button>
      </div>
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

    // Add hover effects
    const cancelBtn = document.getElementById("cancelClearBtn");
    const confirmBtn = document.getElementById("confirmClearBtn");

    cancelBtn.addEventListener("mouseenter", () => {
      cancelBtn.style.opacity = "0.8";
    });
    cancelBtn.addEventListener("mouseleave", () => {
      cancelBtn.style.opacity = "1";
    });

    confirmBtn.addEventListener("mouseenter", () => {
      confirmBtn.style.opacity = "0.8";
    });
    confirmBtn.addEventListener("mouseleave", () => {
      confirmBtn.style.opacity = "1";
    });

    // Handle cancel button
    cancelBtn.addEventListener("click", () => {
      document.body.removeChild(confirmationOverlay);
    });

    // Handle confirm button
    confirmBtn.addEventListener("click", () => {
      // Clear the cart
      localStorage.removeItem("cart");
      localStorage.setItem("cartCount", 0);

      // Remove confirmation popup
      document.body.removeChild(confirmationOverlay);

      // Show success popup
      showClearSuccessPopup();
    });

    // Close popup on overlay click
    confirmationOverlay.addEventListener("click", (e) => {
      if (e.target === confirmationOverlay) {
        document.body.removeChild(confirmationOverlay);
      }
    });

    // Helper function - Success popup after clearing cart
    function showClearSuccessPopup() {
      const successOverlay = document.createElement("div");
      successOverlay.style.cssText = `
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

      const successPopup = document.createElement("div");
      successPopup.style.cssText = `
        background-color: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        text-align: center;
        animation: slideIn 0.3s ease-out;
      `;

      successPopup.innerHTML = `
        <div style="color: #27ae60; font-size: 48px; margin-bottom: 20px;">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2 style="color: #27ae60; margin: 0 0 10px 0;">Cart Cleared!</h2>
        <p style="margin: 20px 0; font-size: 16px; color: #666;">
          Your shopping cart has been cleared successfully.
        </p>
        <button id="successOkBtn" style="
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

      successOverlay.appendChild(successPopup);
      document.body.appendChild(successOverlay);

      // Add hover effect
      const okBtn = document.getElementById("successOkBtn");
      okBtn.addEventListener("mouseenter", () => {
        okBtn.style.opacity = "0.8";
      });
      okBtn.addEventListener("mouseleave", () => {
        okBtn.style.opacity = "1";
      });

      // Handle button click - RELOAD THE PAGE
      okBtn.addEventListener("click", () => {
        window.location.reload();
      });

      // Close on overlay click - RELOAD THE PAGE
      successOverlay.addEventListener("click", (e) => {
        if (e.target === successOverlay) {
          window.location.reload();
        }
      });
    }

    // Helper function - Popup for when cart is already empty
    function showEmptyCartPopup() {
      const emptyOverlay = document.createElement("div");
      emptyOverlay.style.cssText = `
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

      const emptyPopup = document.createElement("div");
      emptyPopup.style.cssText = `
        background-color: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        text-align: center;
        animation: slideIn 0.3s ease-out;
      `;

      emptyPopup.innerHTML = `
        <div style="color: #f39c12; font-size: 48px; margin-bottom: 20px;">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <h2 style="color: #f39c12; margin: 0 0 10px 0;">Cart is Empty!</h2>
        <p style="margin: 20px 0; font-size: 16px; color: #666;">
          Your cart is already empty. Add some items to get started!
        </p>
        <button id="emptyOkBtn" style="
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

      emptyOverlay.appendChild(emptyPopup);
      document.body.appendChild(emptyOverlay);

      // Add hover effect
      const okBtn = document.getElementById("emptyOkBtn");
      okBtn.addEventListener("mouseenter", () => {
        okBtn.style.opacity = "0.8";
      });
      okBtn.addEventListener("mouseleave", () => {
        okBtn.style.opacity = "1";
      });

      // Handle button click
      okBtn.addEventListener("click", () => {
        document.body.removeChild(emptyOverlay);
      });

      // Close on overlay click
      emptyOverlay.addEventListener("click", (e) => {
        if (e.target === emptyOverlay) {
          document.body.removeChild(emptyOverlay);
        }
      });
    }
  };

  // Increase quantity by 1 with stock validation
  window.increaseAmount = function (productId) {
    const item = currentCart.find((item) => item.id === productId);
    if (item) {
      // Check stock before increasing
      if (item.stock && item.quantity >= parseInt(item.stock)) {
        showStockErrorPopup();
        return;
      }
      item.quantity += 1;
      localStorage.setItem("cart", JSON.stringify(currentCart));
      updateCartCount();
      location.reload();
    }
  };

  // Decrease quantity by 1 (remove if quantity reaches 0)
  window.decreaseAmount = function (productId) {
    const item = currentCart.find((item) => item.id === productId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        // Remove item if quantity becomes 0
        const index = currentCart.findIndex((i) => i.id === productId);
        currentCart.splice(index, 1);
      }
      localStorage.setItem("cart", JSON.stringify(currentCart));
      updateCartCount();
      location.reload();
    }
  };

  // Increase quantity from category/product pages (without reload) with stock validation
  window.increaseQuantityInline = function (productId) {
    const item = currentCart.find((item) => item.id === productId);
    if (item) {
      // Check stock before increasing
      if (item.stock && item.quantity >= parseInt(item.stock)) {
        showStockErrorPopup();
        return;
      }
      item.quantity += 1;
      localStorage.setItem("cart", JSON.stringify(currentCart));
      updateCartCount();
      updateAddToCartButtons(); // Refresh button display
    }
  };

  // Decrease quantity from category/product pages (without reload)
  window.decreaseQuantityInline = function (productId) {
    const item = currentCart.find((item) => item.id === productId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(currentCart));
        updateCartCount();
        updateAddToCartButtons(); // Refresh button display
      } else {
        // Remove item if quantity becomes 0
        const index = currentCart.findIndex((i) => i.id === productId);
        currentCart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(currentCart));
        updateCartCount();
        updateAddToCartButtons(); // Refresh button display
      }
    }
  };

  // Function to update "Add to Cart" button states
  window.updateAddToCartButtons = function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Handle regular category buttons (.add-to-cart)
    const buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach((button) => {
      updateSingleButton(button, cart);
    });

    // Handle product page buttons (.add-to-cart-product)
    const buttonsProduct = document.querySelectorAll(".add-to-cart-product");
    buttonsProduct.forEach((button) => {
      updateSingleButton(button, cart);
    });
  };

  // Helper function to update a single button
  function updateSingleButton(button, cart) {
    const productId = button.dataset.productId;
    let productData = {};
    try {
      productData = JSON.parse(
        decodeURIComponent(button.dataset.productData || "{}")
      );
    } catch (error) {
      console.error("Invalid productData on button:", button, button.dataset.productData);
      return;
    }
    const stock = parseInt(productData.stock) || 0;
    const cartItem = cart.find((item) => item.id === productId);

    // Remove any previous out-of-stock class
    button.classList.remove("out-of-stock");

    // Check if out of stock FIRST
    if (stock === 0) {
      button.innerHTML = "Out of Stock";
      button.disabled = true;
      button.classList.add("out-of-stock");
      button.style.cursor = "not-allowed";
      return; // Exit early, don't check cart status
    }

    if (cartItem) {
      // Product is in cart - show quantity controls
      button.innerHTML = `
            <button class="qty-btn qty-minus" onclick="event.stopPropagation(); decreaseQuantityInline('${productId}')">−</button>
            <span class="qty-display">Qty: ${cartItem.quantity}</span>
            <button class="qty-btn qty-plus" onclick="event.stopPropagation(); increaseQuantityInline('${productId}')">+</button>
          `;
      button.classList.add("in-cart");
      button.disabled = true; // Disable the main button
      button.style.cursor = "default";
      // Reset any inline styles that might interfere
      button.style.opacity = "";
      button.style.backgroundColor = "";
      button.style.color = "";
    } else {
      // Product not in cart - show "Add to Cart"
      button.innerHTML = "Add to Cart";
      button.classList.remove("in-cart");
      button.disabled = false;
      button.style.cursor = "pointer";
      // Reset any inline styles
      button.style.opacity = "";
      button.style.backgroundColor = "";
      button.style.color = "";
    }
  }
});

// Event delegation for all "Add to Cart" button clicks
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart") && !e.target.disabled) {
    const productData = JSON.parse(
      decodeURIComponent(e.target.dataset.productData || "{}")
    );
    addToCart(productData);
  }

  if (
    e.target.classList.contains("add-to-cart-product") &&
    !e.target.disabled
  ) {
    const productData = JSON.parse(
      decodeURIComponent(e.target.dataset.productData || "{}")
    );
    addToCart(productData);
  }
});

window.placeOrder = function () {
  const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

  if (currentCart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Create shadow cart from regular cart
  sessionStorage.setItem("shadowCart", JSON.stringify(currentCart));

  // Redirect to buynow page
  window.location.href = "/buynow";
};
