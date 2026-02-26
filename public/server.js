/*
server.js - Backend server for X-Industries Amazon 2.0
This server connects to MongoDB and provides API endpoints for:
- Getting products
- Updating stock
- Managing cart operations
- User authentication (register/login)
- Order management with user association
*/

//AS PART OF PROJECT SETUP - INSTALL ALL OF THESE BELOW
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3010;
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://bhstouff:1234@cluster0.msbys1f.mongodb.net/0?appName=Cluster0";

mongoose
  .connect(MONGODB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error", error);
  });

//product schema
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

// User schema
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Order schema
const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        imageUrl: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    },
    shippingAddress: {
      name: String,
      address: String,
      city: String,
      state: String,
      zip: String,
    },
    paymentInfo: {
      last4: String,
    },
  },
  {
    timestamps: true,
  }
);

//Create models
const Product = mongoose.model("Product", productSchema, "inventory");
const User = mongoose.model("User", userSchema, "users");
const Order = mongoose.model("Order", orderSchema, "orders");

//****************************************************** */
//  MIDDLEWARE - Authentication
//****************************************************** */

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Authentication required", needsLogin: true });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ error: "Invalid or expired token", needsLogin: true });
    }
    req.user = user;
    next();
  });
};

//****************************************************** */
//  API ENDPOINTS - Authentication
//****************************************************** */

// Register new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, phone } = req.body;

    if (!firstName || !lastName || !username || !email || !password || !phone) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or username already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
    });

    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      // Updated -AC
      {
        userId: newUser._id,
        email: newUser.email,
        username: newUser.username,
        phone: newUser.phone,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone, // Added AC
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

// Login user
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: username }, { email: username.toLowerCase() }],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      // updates -AC
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        phone: user.phone,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone, // Added AC
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Get current user info
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user information" });
  }
});

// Updates the User's current information -AC
app.post("/api/auth/update-profile", authenticateToken, async (req, res) => {
  console.log("Hit /api/auth/update-profile");
  try {
    const { firstName, lastName, username, phone, email, password } = req.body;

    // At least one field must be provided
    if (!firstName && !lastName && !username && !phone && !email && !password) {
      return res.status(400).json({ error: "No fields to update provided" });
    }

    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (phone) updates.phone = phone;

    // Hash password if provided
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    if (email) {
      const normalizedEmail = email.toLowerCase();
      updates.email = normalizedEmail;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId, // comes from authenticateToken's decoded JWT
      updates,
      { new: true } // return the updated document
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

// Logout
app.post("/api/auth/logout", authenticateToken, (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

//****************************************************** */
//  API ENDPOINTS - Products
//****************************************************** */

app.get("/", (req, res) => {
  res.json({
    message: "X-Industries API server is running!",
    status: "OK",
  });
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ items: products });
  } catch (error) {
    console.error("Error fetching products: ", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ "sys.id": req.params.id });
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching single product ", error);
    res.status(500).json({ error: "Failed to fetch single product" });
  }
});

app.get("/api/products/category/:category", async (req, res) => {
  try {
    const products = await Product.find({
      "fields.category": req.params.category,
    });
    res.json({ items: products });
  } catch (error) {
    console.error("Error fetching products by category", error);
    res.status(500).json({ error: "Failed to fetch products by category" });
  }
});

app.patch("/api/products/:id/stock", async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Valid quantity required" });
    }
    const product = await Product.findOne({ "sys.id": req.params.id });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.fields.stock < quantity) {
      return res.status(400).json({
        error: "Insufficent stock",
        availible: product.fields.stock,
      });
    }

    product.fields.stock -= quantity;
    await product.save();

    res.json({
      message: "Stock updated successfully",
      newStock: product.fields.stock,
    });
  } catch (error) {
    console.error("Error updating stock: ", error);
    res.status(500).json({ error: "Failed to update stock" });
  }
});

app.post("/api/products/check-stock", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid request format" });
    }
    const stockStatus = [];

    for (const item of items) {
      const product = await Product.findOne({ "sys.id": item.id });

      if (!product) {
        stockStatus.push({
          id: item.id,
          available: false,
          message: "Product not found",
        });
      } else if (product.fields.stock < item.quantity) {
        stockStatus.push({
          id: item.id,
          available: false,
          requestedQuantity: item.quantity,
          availableStock: product.fields.stock,
          message: `Only ${product.fields.stock} available`,
        });
      } else {
        stockStatus.push({
          id: item.id,
          available: true,
          message: "In stock",
        });
      }
    }
    res.json({ stockStatus });
  } catch (error) {
    console.error("Error checking stock: ", error);
    res.status(500).json({ error: "Failed to check stock" });
  }
});

app.get("/api/products/search/:query", async (req, res) => {
  try {
    const searchQuery = req.params.query;

    const products = await Product.find({
      $or: [
        { "fields.title": { $regex: searchQuery, $options: "i" } },
        { "fields.description": { $regex: searchQuery, $options: "i" } },
        { "fields.category": { $regex: searchQuery, $options: "i" } },
        { "fields.brand": { $regex: searchQuery, $options: "i" } },
      ],
    });

    res.json({ items: products });
  } catch (error) {
    console.error("Error searching products: ", error);
    res.status(500).json({ error: "Failed to search products" });
  }
});

//****************************************************** */
//  API ENDPOINTS - Orders (PROTECTED)
//****************************************************** */

app.post("/api/orders/place", authenticateToken, async (req, res) => {
  try {
    const { items, customerInfo } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Verify stock availability
    for (const item of items) {
      const product = await Product.findOne({ "sys.id": item.id });

      if (!product) {
        return res.status(404).json({
          error: `Product ${item.id} not found`,
        });
      }

      if (product.fields.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.fields.title}`,
          available: product.fields.stock,
          requested: item.quantity,
        });
      }
    }

    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOne({ "sys.id": item.id });

      // Update stock
      product.fields.stock -= item.quantity;
      await product.save();

      const itemTotal = product.fields.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.id,
        title: product.fields.title,
        description: item.description || product.fields.description || "",
        price: product.fields.price,
        quantity: item.quantity,
        imageUrl: product.fields.image.fields.file.url,
      });
    }

    // Create order
    const orderId = "ORD-" + Date.now();
    const newOrder = new Order({
      orderId,
      userName: req.user.username,
      userId: req.user.userId,
      userEmail: req.user.email,
      items: orderItems,
      totalAmount,
      shippingAddress: customerInfo
        ? {
            name: customerInfo.name,
            address: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
            zip: customerInfo.zip,
          }
        : {},
      paymentInfo: customerInfo?.cardNumber
        ? {
            last4: customerInfo.cardNumber.slice(-4),
          }
        : {},
      status: "pending",
    });

    await newOrder.save();

    res.json({
      success: true,
      message: "Order placed successfully!",
      orderId: newOrder.orderId,
      order: {
        orderId: newOrder.orderId,
        items: newOrder.items,
        totalAmount: newOrder.totalAmount,
        createdAt: newOrder.createdAt,
      },
    });
  } catch (error) {
    console.error("Error placing order", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Get user's orders
app.get("/api/orders/my-orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get specific order
app.get("/api/orders/:orderId", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      userId: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API is available at http://localhost:${PORT}`);
});
