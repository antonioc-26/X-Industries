const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://bhstouff:1234@cluster0.msbys1f.mongodb.net/0?appName=Cluster0";

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

const Product = mongoose.model("Product", productSchema, "inventory");

async function importData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const data = JSON.parse(
      fs.readFileSync("products_real_titles.json", "utf-8")
    );

    // Clear the collection
    await Product.deleteMany({});
    console.log("Cleared existing data");

    // Insert each product as a separate document
    await Product.insertMany(data.items);
    console.log(`Imported ${data.items.length} products successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
}

importData();
