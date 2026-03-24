/*
------------------------------------------------------------
Author: Antonio Corona
Last Updated: 2026-03-19
Project: X-Industries
File: db.js

Description:
  Handles the connection to the MongoDB database using Mongoose.

Responsibilities:
  - Establish connection to MongoDB Atlas using environment variables
  - Provide a reusable database connection function for the server
  - Handle connection errors and terminate the process if connection fails
------------------------------------------------------------
*/
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;