const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    // Use MongoDB Atlas connection string from environment variables
    // For local development, this will be set in .env file
    // For production, this will be set in Netlify environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://demo-user:demo-password@cluster0.mongodb.net/multiverse-platform?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Routes
app.get('/.netlify/functions/api', (req, res) => {
  res.json({ message: 'Multiverse Platform API is running' });
});

// Import route files
const propertyRoutes = require('./routes/propertyRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const financeRoutes = require('./routes/financeRoutes');
const constructionRoutes = require('./routes/constructionRoutes');
const businessRoutes = require('./routes/businessRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/.netlify/functions/api/properties', propertyRoutes);
app.use('/.netlify/functions/api/auctions', auctionRoutes);
app.use('/.netlify/functions/api/finance', financeRoutes);
app.use('/.netlify/functions/api/construction', constructionRoutes);
app.use('/.netlify/functions/api/business', businessRoutes);
app.use('/.netlify/functions/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for serverless deployment
module.exports.handler = serverless(app);
