/*
------------------------------------------------------------
Author: Antonio Corona
Last Updated: 2026-03-19
Project: X-Industries
File: config.js

Description:
  Centralized configuration file for managing API endpoints,
  page routes, and static data paths across the application.

Responsibilities:
  - Define API endpoint URLs for backend communication
  - Define frontend route paths for navigation
  - Provide reusable constants across all modules
  - Ensure maintainability by avoiding hardcoded values
------------------------------------------------------------
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
  home: "/",
  login: "/login",
  register: "/account",
  dashboard: "/dashboard",
  cart: "/cart",
  buyNow: "/buynow",
  loginSettings: "/login-settings",
  orders: "/orders",
  profile: "/profile",
  
  books: "/books",
  movies: "/movies",
  electronics: "/electronics",
  videoGames: "/video-games",
  toys: "/toys",
  misc: "/misc",

  product: "/product",
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