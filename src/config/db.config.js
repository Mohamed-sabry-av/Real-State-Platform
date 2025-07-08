const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Connect to MongoDB function
const connectDB = async () => {
  try {
    const DB_URL = process.env.DATABASE_URI;
    await mongoose.connect(DB_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
