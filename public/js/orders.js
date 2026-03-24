/*
------------------------------------------------------------
Author: Antonio Corona
Last Updated: 2026-03-19
Project: X-Industries
File: orders.js

Description:
  Manages order history display and recent order retrieval.

Responsibilities:
  - Fetch authenticated user order history
  - Render order cards dynamically
  - Display most recent order on dashboard
  - Integrate product data for item details
------------------------------------------------------------
*/

import { API_ENDPOINTS, PAGE_ROUTES, DATA_PATHS } from "./config.js";

async function fetchOrders() {
  const token = window.Auth?.getToken();

  if (!token) {
    sessionStorage.setItem("redirectAfterLogin", PAGE_ROUTES.orders);
    window.location.href = PAGE_ROUTES.login;
    return null;
  }

  const response = await fetch(API_ENDPOINTS.myOrders, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch orders");
  }

  return data.orders || [];
}

async function fetchProductsList() {
  const response = await fetch(DATA_PATHS.productsJson);
  if (!response.ok) {
    throw new Error("Failed to load product catalog");
  }

  const productsJSON = await response.json();
  return productsJSON.items || [];
}

function buildOrderCard(order, productsList) {
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
        <p>${order.shippingAddress?.name || "N/A"}</p>
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

    <div class="order-history-items-block"></div>
  `;

  const itemsBlock = orderCard.querySelector(".order-history-items-block");

  order.items.forEach((item) => {
    const product = productsList.find((p) => p.sys?.id == item.productId);
    const description =
      product?.fields?.description ||
      item.description ||
      "Description not available";
    const stock = product?.fields?.stock ?? 0;
    const link = `product.html?id=${item.productId}`;

    const itemRow = document.createElement("div");
    itemRow.classList.add("order-history-item-row");

    itemRow.innerHTML = `
      <img src="${item.imageUrl}" class="order-history-item-img" />
      <div class="order-history-item-info">
        <p class="order-history-item-title">${item.title}</p>
        <p class="item-description">${description}</p>
        <p class="items-bought">Items Bought: ${item.quantity}</p>
        <p class="return-text">Return or replace items: Eligible through January 31, 2026</p>
        <div class="item-buttons">
          <a href="${link}">
            <button class="white-btn">View your item</button>
          </a>
          <button class="add-to-cart">Buy it again</button>
        </div>
      </div>
    `;

    const buyAgainButton = itemRow.querySelector(".add-to-cart");
    buyAgainButton.dataset.productId = item.productId;
    buyAgainButton.dataset.productData = encodeURIComponent(
      JSON.stringify({
        id: item.productId,
        title: item.title,
        image: item.imageUrl,
        price: item.price,
        description,
        stock,
      })
    );

    itemsBlock.appendChild(itemRow);
  });

  return orderCard;
}

async function loadOrdersPage() {
  const ordersContainer = document.getElementById("order-history-items-container");
  if (!ordersContainer) return;

  try {
    const [orders, productsList] = await Promise.all([
      fetchOrders(),
      fetchProductsList(),
    ]);

    if (!orders) return;

    if (orders.length === 0) {
      ordersContainer.innerHTML = "<p>No orders found.</p>";
      return;
    }

    orders.forEach((order) => {
      ordersContainer.appendChild(buildOrderCard(order, productsList));
    });

    if (typeof updateAddToCartButtons === "function") {
      updateAddToCartButtons();
    }
  } catch (error) {
    console.error("Error loading orders page:", error);
    ordersContainer.innerHTML = "<p>Failed to load orders.</p>";
  }
}

async function loadDashboardRecentOrder() {
  const dashboardGrid = document.getElementById("DASHBOARD_GRID");
  const mostRecentOrderContainer = document.getElementById(
    "most-recent-order-history-items-container"
  );

  if (!dashboardGrid || !mostRecentOrderContainer) return;

  try {
    const styles = window.getComputedStyle(dashboardGrid);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;

    const dashboardContainerWidth =
      dashboardGrid.clientWidth - paddingLeft - paddingRight - 40;

    document.documentElement.style.setProperty(
      "--dashboard-container-width",
      `${dashboardContainerWidth}px`
    );

    const [orders, productsList] = await Promise.all([
      fetchOrders(),
      fetchProductsList(),
    ]);

    if (!orders) return;

    if (orders.length === 0) {
      mostRecentOrderContainer.innerHTML = "<p>No orders found.</p>";
      return;
    }

    const sortedOrders = [...orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    mostRecentOrderContainer.appendChild(
      buildOrderCard(sortedOrders[0], productsList)
    );

    if (typeof updateAddToCartButtons === "function") {
      updateAddToCartButtons();
    }
  } catch (error) {
    console.error("Error loading dashboard recent order:", error);
    mostRecentOrderContainer.innerHTML = "<p>Failed to load recent order.</p>";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadOrdersPage();
  await loadDashboardRecentOrder();
});