/*
Author: Antonio Corona
Last Updated: 2026-03-18

config.js
Centralized frontend configuration for API routes, pages, and shared paths.
*/

const API_BASE_URL = "/api";

const API_ENDPOINTS = {
  products: `${API_BASE_URL}/products`,
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  logout: `${API_BASE_URL}/auth/logout`,
  updateProfile: `${API_BASE_URL}/auth/update-profile`,
  placeOrder: `${API_BASE_URL}/orders/place`,
  myOrders: `${API_BASE_URL}/orders/my-orders`,
};

const PAGE_ROUTES = {
  home: "index.html",
  login: "login.html",
  register: "account.html",
  dashboard: "dashboard.html",
  cart: "cart.html",
  buyNow: "buynow.html",
  loginSettings: "login-settings.html",
  orders: "orders.html",
};

const DATA_PATHS = {
  productsJson: "data/product_real_titles.json",
};

const EXTERNAL_URLS = {
  fontAwesome: "https://kit.fontawesome.com/aa8c13a461.js",
};

export {
  API_BASE_URL,
  API_ENDPOINTS,
  PAGE_ROUTES,
  DATA_PATHS,
  EXTERNAL_URLS,
};