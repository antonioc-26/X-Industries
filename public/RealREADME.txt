Course: CMSC 421
Assignment: Final Project
Authors: Lauryn Gilbert, Brooks Stouffer, Damion Crawford
            Antonio Corona, and Tyler Strohl


* Overall Project Description
    This is a Amazon style website that uses an Express and Node.js server with a MongoDB
    database allowing users to create/login accounts, add things to their cart, and 
    purchase orders. There are 6 categories and 100 items to pick from with prices. All 
    information for the users and products are stored in the database.  


* README Contents:
    - Project Setup
    - Team Member Roles & Responsibilities
    - Implemented Features & Issues
------------------------------------------------------

---------------------------
Project Setup Instructions:
---------------------------

1. If running on codesandbox type "npm start"
    (if starting from scratch and do not have dependencies installed
    you will need to type in all the commands below in number 2)

2. If running on own system, install dependencies at the top of server.js
    "npm install"
    "npm install express"
    "npm install mongoose"
    "npm install cors"
    "npm install bcrypt"
    "npm install jsonwebtoken"
    "npm install dotenv" 
    "npm start"



-------------------------------------
Team Member Roles & Responsibilities:
-------------------------------------

Lauryn: 
    * Coordinated Project Goals
    * Organized CSS
    * Created search bar (search on enter key or search logo, searches partial matches)
    * Coloring and formatting 
        (formatting for create account page, buynow.html, 
         product.html, make style correspong on all pages, gradient background)
    * Login/create account save to mongo database
        - Make sure you must be logged in to place an order
        - login.js, auth.js, register.js
    * Quantity control (chevrons) in cart on individual items
        - Quantity control(+/-) on add to cart button on all pages
    * Accumulate price in cart
    * Debugging
    * Enforce restrictions (e.g. Cannot add to cart more than what is in stock)
    * Added badges that say out of stock or only a few left
    * Supplied images 41-60 

Brooks: 
    * Created mongo database
    * Created cluster that saved order information
    * Implemented stock keeping through mongo
    * Debugging 
    * Made Clear cart button 
    * Footer
    * Formatting (e.g. empty cart, cart background, login page)
    * Supplied images 61-80
          
Damion: 
    * Polished shipping/payment contents for order form
    * Helped with clear cart button
    * Created discord server for group to communicate
    * Supplied images 21-40

Antonio: 
    * Category & Product Grids / Load products.
        - Loaded products to home page and category pages
        - Enforced category filter by navigation bar
    * Created the information cards, loaded the information of products, 
        - set the intitial template for all product cards throughout home, category, and individual product. 
    * Account Dashboard
        - Change your name, phone number, email (possibly adding change username and update password)
        - Most recent order
        - Relocated functionality and Created Logout Button
            * Profile htmls
            * Login-Settings Page and functionality
    * Home Page
        - Six category grids 
        - Loaded products to the home category grids
    * Running cart total (sticky)
        - Created the different components of it.
    * Started structure of html files
    * Created the header structure and incorporated the navigation bar
    * Supplied images 1-20
    * Order History 
        - Helped with the structure and style of the order history 

Tyler: 
    * Order History
    * Made buttons, including "Add to Cart" & "Buy Now"
    * Assisted in CSS formatting
    * Assisted in Cart functionality
    * Debugging
    * Helped coordinate project goals 
    * Supplied images 81-100   

---------------------
Implemented Features:
---------------------

* Homepage (w/ Featured Products that are clickable)

* Shopping Cart 
    - Quantity controls (chevrons)
    - Remove from cart (removes current item from cart)
    - Clear cart (removes all items from cart)
    - Place order
    - Cart saves when refreshing

* Search & Nav Bars
    - Bars are universal to the webpage
    - Searches on enter or clicking search icon
    - Finds partial matches
    - Finds matches even if not in that category
    - Nav Bar to access various pages (categories, cart, account, orders, search)

* Category Pages
    - Categories are books, movies, electronics, video games, toys, misc
    - Products are displayed in a grid and will display based on category
    - Each product has its own title, image, price, desc, and stock
    - Add to Cart & Buy Now options for each product

* Product Pages
    - Each product has its own page accessed by clicking on its image
    - Includes description of the product
    - Includes product info such as price, stock, rating
    - Add to Cart & Buy Now options

* Order Placement
    - Buy now (buy the current item in a "shadow-cart")
    - Buy the current items in your cart, and update stock in database
    - Order contains each product bought and its info
    - Payment & Shipping info

* Order History
    - Product List
    - Product Info (name, id, desc, etc)
    - Order arrival date, total price, shipping, and order #

* Accounts/Login
    - Sign in/out of an account
    - Stored account data in Mongo DB
    - Current cart tied to account
    - Order History
    - Cannot place order unless logged in
    - Can create account

* Account Dashboard
    - Sign Out
    - Edit Account Info (Login, name, payment/shipping, etc)
    - Your Orders

-------------
Known Issues:
-------------

* Difficult to make objects sticky (ex: Search Bar)
* Had to change ports to make project work (original port was 3000, second port was 3001, current port is 3002)
* Cannot open multiple projects on the same port
* Under certain circumstances, items remain in cart even after placing an order.


-----------------------------
Not currently fully function and a work in progress: 
-----------------------------

* In the order history "order details" and "invoice" not fully functioning
* On the dashboard, change your username and user information is not finished