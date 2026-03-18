/*
Author: Antonio Corona
Last Updated: 2026-03-18

config.js
Centralized API configuration
Automatically switches between local and production
*/

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_URL = isLocalhost
  ? "http://localhost:3010/api"
  : "/api"; // production (same domain)

export { API_URL };