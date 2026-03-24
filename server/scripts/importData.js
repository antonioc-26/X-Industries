/*
------------------------------------------------------------
Author: Antonio Corona
Last Updated: 2026-03-19
Project: X-Industries
File: importData.js

Description:
  Script used to import and seed product data into the MongoDB
  "inventory" collection from a local JSON file.

Responsibilities:
  - Load product data from public/data/product_real_titles.json
  - Validate JSON structure before import
  - Clear existing inventory data in MongoDB
  - Insert updated product data into the database
  - Provide console feedback on import status

Notes:
  - This script replaces all existing inventory data
  - Used during development to sync MongoDB with local data
------------------------------------------------------------
*/

require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// --- Mongo Connection ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// --- Product Schema (must match server.js schema) ---
const productSchema = new mongoose.Schema(
  {
    sys: {
      id: { type: String, required: true, unique: true },
    },
    fields: {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      image: {
        fields: {
          file: {
            url: { type: String, required: true },
          },
        },
      },
      description: { type: String },
      category: { type: String, required: true },
      stock: { type: Number, required: true, default: 0 },
      rating: { type: Number },
      brand: { type: String },
      details: { type: mongoose.Schema.Types.Mixed },
    },
  },
  {
    timestamps: true,
  }
);

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
    const parsedData = JSON.parse(rawData);

    const products = parsedData.items;

    if (!Array.isArray(products)) {
      throw new Error("JSON file does not contain an items array.");
    }

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log(`Data Imported Successfully: ${products.length} products added`);
    process.exit();
  } catch (error) {
    console.error("Import Error:", error);
    process.exit(1);
  }
};

importData();