# 🛒 X-Industries
This project was built to simulate a real-world e-commerce platform and demonstrate full-stack development skills in a production-style environment.

A full-stack e-commerce application built with Node.js, Express, and MongoDB, demonstrating real-world concepts such as authentication, REST APIs, database integration, and dynamic UI rendering.

Users can browse products, search by category, manage a shopping cart, create accounts, and place orders with persistent storage using MongoDB.

---

## 🚀 Live Demo

Try the live application here:

https://x-industries.onrender.com

> Note: This project is hosted on Render’s free tier, so the first load may take a few seconds while the server wakes up.

---

## 📸 Screenshots

### Home Page
![Home](screenshots/home.jpg)

### Product Page
![Product](screenshots/product.jpg)

### Orders Page
![Orders](screenshots/orders.jpg)

### Dashboard Page
![Dashboard](screenshots/dashboard.jpg)

---

## ✨ Features

- 🛍️ Product browsing by category
- 🔍 Search functionality
- 🛒 Shopping cart system with quantity controls
- ⚡ Buy Now checkout flow
- 👤 User authentication (register/login/logout)
- 📦 Order history tracking
- 📊 User dashboard with recent orders
- 🔁 “Buy Again” functionality from previous orders
- 🧠 Centralized configuration system (no hardcoded URLs)
- ☁️ MongoDB Atlas database integration

---

## 🚀 Key Technical Highlights

- Designed and implemented a full-stack architecture using Express to serve both frontend and API routes
- Built a RESTful API supporting authentication, products, and order management
- Integrated MongoDB Atlas with Mongoose for persistent, structured data storage
- Implemented JWT-based authentication with protected routes
- Developed a dynamic frontend using vanilla JavaScript and ES modules
- Created a centralized configuration system to eliminate hardcoded API and route values
- Managed client-side state using localStorage and sessionStorage

---

## 🧾 Order System

Users can:

- Place orders from the cart or buy-now flow
- View full order history
- View most recent order on dashboard
- Re-add previous items using "Buy it again"

All orders are stored in MongoDB and fetched via authenticated API requests.

---

## 🔐 Authentication

- Secure user registration and login
- JWT-based authentication
- Token stored in localStorage
- Protected routes (orders, dashboard, profile)

---

## 🚀 Deployment

The application is deployed as a full-stack Node/Express web service on Render.

- Frontend is served from the Express server
- Backend API routes are hosted on the same Render service
- MongoDB Atlas is used for persistent product, user, and order data
- Environment variables are managed through Render

---

## Project Status

This project is deployed as a live portfolio application and is actively maintained. Future improvements may include additional UI polish, admin tools, advanced filtering, and further backend modularization.

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Other
- REST APIs
- LocalStorage (cart persistence)
- SessionStorage (checkout flow)

---

## 📁 Project Structure

```
x-industries/
├── LICENSE
├── README.md
├── package-lock.json
├── package.json
├── public
│   ├── assets
│   │   ├── accounts.png
│   │   ├── avatar.png
│   │   ├── cart.png
│   │   ├── orders.png
│   │   ├── product1.jpg    # Products 1-100
│   ├── data
│   │   └── product_real_titles.json
│   ├── js
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── buynow.js
│   │   ├── cart.js
│   │   ├── category.js
│   │   ├── config.js
│   │   ├── login.js
│   │   ├── orders.js
│   │   ├── product.js
│   │   ├── profile.js
│   │   ├── register.js
│   │   └── search.js
│   ├── pages
│   │   ├── account.html
│   │   ├── books.html
│   │   ├── buynow.html
│   │   ├── cart.html
│   │   ├── dashboard.html
│   │   ├── electronics.html
│   │   ├── index.html
│   │   ├── login-settings.html
│   │   ├── login.html
│   │   ├── misc.html
│   │   ├── movies.html
│   │   ├── orders.html
│   │   ├── product.html
│   │   ├── profile.html
│   │   ├── toys.html
│   │   └── video-games.html
│   └── styles
│       └── styles.css
├── screenshots
│   ├── dashboard.jpg
│   ├── home.jpg
│   ├── orders.jpg
│   └── product.jpg
└── server
    ├── config
    │   └── db.js
    ├── scripts
    │   └── importData.js
    └── server.js
```

---

## ⚙️ Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/antonioc-26/X-Industries.git
cd x-industries
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables
Create a .env file:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3010
```

4. Seed the database
```bash
npm run import:data
```

5. Start the server
```bash
npm start
```

6. Open the app
```
http://localhost:3010
```

---

## 💻 Development

To modify or extend the project:

1. Run the server locally
2. Edit frontend JS/HTML/CSS files
3. Update backend routes or models as needed
4. Refresh browser to test changes

---

## 🧠 Key Improvements (Post-Migration)

- Migrated from CodeSandbox → GitHub
- Refactored project structure
- Implemented MongoDB Atlas integration
- Built full authentication system
- Created order history + dashboard system
- Centralized all API routes using config.js
- Converted frontend scripts to ES modules
- Fixed multiple data flow and state management bugs

---

## 🤝 Contributing

Contributions are welcome.

If you'd like to improve the project:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📌 Versioning

v1.0.0 — First live deployed full-stack release with authentication, MongoDB Atlas integration, product catalog, cart management, checkout flow, and order history.

---

## 📄 License

This project is open source and available under the **MIT License**.

---

## 👤 Author

Developed by: Antonio Corona Montes De Oca  
GitHub: https://github.com/antonioc-26
