/**
 * MongoDB Atlas setup script
 * This script automates the MongoDB Atlas connection setup for the Multiverse Platform
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Models to register
const models = [
  'Property',
  'Auction',
  'User',
  'FinanceApplication',
  'ConstructionService',
  'BusinessModel'
];

// Register all models
models.forEach(model => {
  require(`../models/${model}`);
  console.log(`Registered model: ${model}`);
});

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

/**
 * Initialize database connection
 */
async function initializeDatabase() {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    // Create indexes for all models
    console.log('Creating indexes for all models...');
    await Promise.all(models.map(model => mongoose.model(model).createIndexes()));
    
    console.log('Database initialization complete');
    return conn;
  } catch (error) {
    console.error(`Error initializing database: ${error.message}`);
    throw error;
  }
}

/**
 * Create sample data for testing
 */
async function createSampleData() {
  try {
    // Check if sample data already exists
    const userCount = await mongoose.model('User').countDocuments();
    if (userCount > 0) {
      console.log('Sample data already exists, skipping creation');
      return;
    }

    console.log('Creating sample data...');
    
    // Create admin user
    const User = mongoose.model('User');
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@multiverse-platform.com',
      password: 'Password123!',
      role: 'admin',
      isVerified: true,
      ficoScore: 750,
      isDRAHEligible: true
    });
    await admin.save();
    
    // Create sample property
    const Property = mongoose.model('Property');
    const property = new Property({
      title: 'Vacant Lot in St. Bernard Parish',
      description: 'Beautiful vacant lot ready for new construction in disaster recovery area.',
      propertyType: 'vacant_lot',
      environment: 'real_world',
      status: 'available',
      price: 25000,
      size: 5000,
      sizeUnit: 'sqft',
      location: {
        address: '123 Recovery St',
        city: 'St. Bernard Parish',
        state: 'LA',
        zipCode: '70032',
        coordinates: {
          type: 'Point',
          coordinates: [-89.9684, 29.9391]
        }
      },
      images: [{
        url: 'https://example.com/sample-lot.jpg',
        caption: 'Vacant lot view',
        isPrimary: true
      }],
      features: ['Corner lot', 'Utilities available', 'Ready for construction'],
      isDRAH: true,
      drahDetails: {
        disasterType: 'hurricane',
        affordableHousingEligible: true,
        constructionReady: true
      },
      cityResources: {
        assessorUrl: 'https://stbernardassessor.org',
        taxDepartmentUrl: 'https://stbernardtax.org',
        buildingPermitUrl: 'https://stbernard.org/permits',
        gisMapUrl: 'https://stbernard.org/gis'
      },
      createdBy: admin._id
    });
    await property.save();
    
    console.log('Sample data created successfully');
  } catch (error) {
    console.error(`Error creating sample data: ${error.message}`);
    throw error;
  }
}

// Export functions for use in serverless functions
module.exports = {
  initializeDatabase,
  createSampleData
};

// If this script is run directly, initialize the database
if (require.main === module) {
  (async () => {
    try {
      await initializeDatabase();
      await createSampleData();
      console.log('Database setup complete');
      process.exit(0);
    } catch (error) {
      console.error('Database setup failed:', error);
      process.exit(1);
    }
  })();
}
