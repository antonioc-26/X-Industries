/*
Author: Antonio Corona
Last Updated: 2026-03-18

*/

import { API_ENDPOINTS, PAGE_ROUTES, DATA_PATHS } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const ordersContainer = document.getElementById(
    "order-history-items-container"
  );

  const token = Auth.getToken();
  const user = Auth.getUser();

  if (!token) {
    sessionStorage.setItem("redirectAfterLogin", "orders.html");
    window.location.href = PAGE_ROUTES.login;
    return;
  }

  try {
    const response = await fetch(API_ENDPOINTS.myOrders, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch orders");
    }

    if (!data.orders || data.orders.length === 0) {
      ordersContainer.innerHTML = "<p1>No orders found.</p1>";
      return;
    }

    const productsJSON = await fetch(DATA_PATHS.productsJson).then((res) =>
      res.json()
    );
    const productsList = productsJSON.items;

    //IMPORTANT LOOP FOR DISPLAYING ORDERS:

    //by default, should display first 3 prodicts first, so change loop for that condition
    //if some boolean:

    //else:
    //the old code goes in here

    data.orders.forEach((order) => {
      const orderCard = document.createElement("div");
      orderCard.classList.add("order-history-card");

      orderCard.innerHTML = `
        <div class="order-history-header">
          <div>
            <p class="label">ORDER PLACED</p>
            <p>${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p class="label">TOTAL</p>
            <p>$${order.totalAmount.toFixed(2)}</p>
          </div>
          <div>
            <p class="label">SHIP TO</p>
            <p>${order.shippingAddress.name}</p>
          </div>
          <div class="order-history-id">
            <p>ORDER # ${order.orderId}</p>
            <a class="order-history-details-link" href="#">View order details</a> |
            <a class="order-history-details-link" href="#">View invoice</a>
          </div>
        </div>

        <div class="delivery-status">
          <h2>Delivered ${new Date(order.createdAt).toLocaleDateString()}</h2>
          <p>Package was left inside the residence’s mailbox</p>
        </div>

        <div class="order-history-items-block">
          ${order.items
            .map((item) => {
              const product = productsList.find(
                (p) => p.sys?.id == item.productId
              );
              const description =
                product?.fields?.description || "Description not available";
              const link = `product.html?id=${item.productId}`;
              const stock = product.fields.stock;

              return `
                <div class="order-history-item-row">
                  <img src="${item.imageUrl}" class="order-history-item-img" />
                  <div class="order-history-item-info">
                    <p class="order-history-item-title">${item.title}</p>
                    <p class="item-description">${description}</p>
                    <p class="items-bought">Items Bought: ${item.quantity}</p>
                    <p class="return-text">Return or replace items: Eligible through January 31, 2026</p>
                    <div class="item-buttons">
                    <a href="${link}"><button class="white-btn">View your item</button></a>
                    <button 
                      class="add-to-cart" 
                      data-product-id="${item.productId}" 
                      data-product-data='${JSON.stringify({
                        id: item.productId,
                        title: item.title,
                        image: item.imageUrl,
                        price: item.price,
                        description: description,
                        stock: stock,
                      })}'>
                      Buy it again
                    </button>
                  </div>
                  
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
      ordersContainer.appendChild(orderCard);
    });

    // Initialize cart button states after rendering
    if (typeof updateAddToCartButtons === "function") {
      updateAddToCartButtons();
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    ordersContainer.innerHTML = "<p>Failed to load orders.</p>";
  }
});

// ---------------------------------------------
// DASHBOARD: Load only MOST RECENT ORDER
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const containerElement = document.getElementById("DASHBOARD_GRID");

  const styles = window.getComputedStyle(containerElement);
  const paddingLeft = parseFloat(styles.paddingLeft);
  const paddingRight = parseFloat(styles.paddingRight);

  // clientWidth = content + paddingLeft + paddingRight
  const dashboardContainerWidth =
    containerElement.clientWidth - paddingLeft - paddingRight - 40; // removing an additional 40 to take into account the padding around the recent order container

  document.documentElement.style.setProperty(
    "--dashboard-container-width",
    dashboardContainerWidth + "px"
  );

  // console.log("paddingLeft:", styles.paddingLeft);
  // console.log("paddingRight:", styles.paddingRight);

  const mostRecentOrderContainer = document.getElementById(
    "most-recent-order-history-items-container"
  );

  const token = Auth.getToken();
  const user = Auth.getUser();

  if (!token) {
    sessionStorage.setItem("redirectAfterLogin", "orders.html");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(API_ENDPOINTS.myOrders, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch orders");
    }

    if (!data.orders || data.orders.length === 0) {
      mostRecentOrderContainer.innerHTML = "<p1>No orders found.</p1>";
      return;
    }

    const productsJSON = await fetch(DATA_PATHS.productsJson).then((res) =>
      res.json()
    );
    const productsList = productsJSON.items;

    // 1. Sort orders by date descending
    const sortedOrders = data.orders.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // 2. Take only the most recent
    const order = sortedOrders[0];

    const orderCard = document.createElement("div");
    orderCard.classList.add("order-history-card");

    orderCard.innerHTML = `
  <div class="order-history-header">
    <div>
      <p class="label">ORDER PLACED</p>
      <p>${new Date(order.createdAt).toLocaleDateString()}</p>
    </div>
    <div>
      <p class="label">TOTAL</p>
      <p>$${order.totalAmount.toFixed(2)}</p>
    </div>
    <div>
      <p class="label">SHIP TO</p>
      <p>${order.shippingAddress.name}</p>
    </div>
    <div class="order-history-id">
      <p>ORDER # ${order.orderId}</p>
      <a class="order-history-details-link" href="#">View order details</a> |
      <a class="order-history-details-link" href="#">View invoice</a>
    </div>
  </div>

  <div class="delivery-status">
    <h2>Delivered ${new Date(order.createdAt).toLocaleDateString()}</h2>
    <p>Package was left inside the residence’s mailbox</p>
  </div>

  <div class="order-history-items-block">
    ${order.items
      .map((item) => {
        const product = productsList.find((p) => p.sys?.id == item.productId);
        const description =
          product?.fields?.description || "Description not available";
        const link = `product.html?id=${item.productId}`;
        const stock = product.fields.stock;

        return `
        <div class="order-history-item-row">
          <img src="${item.imageUrl}" class="order-history-item-img" />
          <div class="order-history-item-info">
            <p class="order-history-item-title">${item.title}</p>
            <p class="item-description">${description}</p>
            <p class="items-bought">Items Bought: ${item.quantity}</p>
            <p class="return-text">Return or replace items: Eligible through January 31, 2026</p>
            <div class="item-buttons">
              <a href="${link}"><button class="white-btn">View your item</button></a>
              <button 
                class="add-to-cart"
                data-product-id="${item.productId}"
                data-product-data='${JSON.stringify({
                  id: item.productId,
                  title: item.title,
                  image: item.imageUrl,
                  price: item.price,
                  description,
                  stock,
                })}'
              >
                Buy it again
              </button>
            </div>
          </div>
        </div>
      `;
      })
      .join("")}
  </div>
`;

    mostRecentOrderContainer.appendChild(orderCard);

    // Initialize cart button states after rendering
    if (typeof updateAddToCartButtons === "function") {
      updateAddToCartButtons();
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    mostRecentOrderContainer.innerHTML = "<p>Failed to load orders.</p>";
  }
});
