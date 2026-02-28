// Author: Antonio Corona
// Data Import Script for X-Industries
// Imports product data from JSON file into MongoDB "inventory" collection

require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// --- Mongo Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// --- Product Schema (must match server.js schema) ---
const productSchema = new mongoose.Schema({
  title: String,
  category: String,
  price: Number,
  image: String,
  description: String,
  rating: Number,
  countInStock: Number
});

// Explicitly bind to "inventory" collection
const Product = mongoose.model("Product", productSchema, "inventory");

// --- Load JSON file from public/data ---
const dataPath = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "data",
  "product_real_titles.json"
);

const importData = async () => {
  try {
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const products = JSON.parse(rawData);

    // Optional: clear existing products before import
    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Data Imported Successfully");
    process.exit();
  } catch (error) {
    console.error("Import Error:", error);
    process.exit(1);
  }
};

importData();