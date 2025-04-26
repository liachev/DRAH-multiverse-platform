/**
 * MongoDB Atlas connection configuration
 * This file handles the database connection setup and provides a connection instance
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection string - will be set in environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/multiverse-platform?retryWrites=true&w=majority';

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4 // Use IPv4, skip trying IPv6
};

// Create a cached connection variable
let cachedConnection = null;

/**
 * Connect to MongoDB Atlas
 * @returns {Promise<mongoose.Connection>} Mongoose connection
 */
async function connectToDatabase() {
  // If we have a cached connection, return it
  if (cachedConnection) {
    return cachedConnection;
  }

  // Connect to MongoDB
  try {
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    // Cache the connection
    cachedConnection = conn;
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // For serverless functions, we should return the error rather than exiting
    throw error;
  }
}

/**
 * Get the MongoDB connection
 * @returns {Promise<mongoose.Connection>} Mongoose connection
 */
async function getConnection() {
  return connectToDatabase();
}

module.exports = {
  connectToDatabase,
  getConnection
};
