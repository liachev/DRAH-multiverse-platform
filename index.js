const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/multiverse-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const propertyRoutes = require('./api/routes/propertyRoutes');
const auctionRoutes = require('./api/routes/auctionRoutes');
const userRoutes = require('./api/routes/userRoutes');
const businessRoutes = require('./api/routes/businessRoutes');
const metaverseRoutes = require('./api/routes/metaverseRoutes');
const integrationRoutes = require('./api/routes/integrationRoutes');
const propertyScraperRoutes = require('./api/routes/propertyScraperRoutes');
const auctionFunctionalityRoutes = require('./api/routes/auctionFunctionalityRoutes');
const locationSearchRoutes = require('./api/routes/locationSearchRoutes');
const resourceLinksRoutes = require('./api/routes/resourceLinksRoutes');
const aecDrahServiceRoutes = require('./api/routes/aecDrahServiceRoutes');
const aiBusinessRoutes = require('./api/routes/aiBusinessRoutes');
const testingRoutes = require('./api/routes/testingRoutes');
const drahFinanceRoutes = require('./api/routes/drahFinanceRoutes');

// Use routes
app.use('/api/properties', propertyRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/metaverse', metaverseRoutes);
app.use('/api/integration', integrationRoutes);
app.use('/api/scraper', propertyScraperRoutes);
app.use('/api/auction-functionality', auctionFunctionalityRoutes);
app.use('/api/location', locationSearchRoutes);
app.use('/api/resources', resourceLinksRoutes);
app.use('/api/aec-drah', aecDrahServiceRoutes);
app.use('/api/ai-business', aiBusinessRoutes);
app.use('/api/testing', testingRoutes);
app.use('/api/drah-finance', drahFinanceRoutes);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: err.message || 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
