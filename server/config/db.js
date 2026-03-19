/*
------------------------------------------------------------
Author: Antonio Corona
Last Updated: 2026-03-19
Project: X-Industries
File: db.js

Discription:
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