import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3010;

// IMPORTANT: Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "/public")));

// Alternative if above doesn't work:
// app.use(express.static('public'));

// Route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public", "index.html"));
});

// Route for products_real_titles
app.get("/products_real_titles.json", (req, res) => {
  res.sendFile(path.join(__dirname, "/public", "products_real_titles.json"));
});

// Catch-all route for other HTML pages
app.get("/*.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/public", req.path));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
