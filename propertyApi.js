/**
 * Property API - Serverless Functions
 * Handles all property-related operations for the Multiverse Platform
 */

const mongoose = require('mongoose');
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('../config/database');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed' 
    });
  }
});

// Load Property model
const Property = mongoose.model('Property');

/**
 * @route   GET /api/properties
 * @desc    Get all properties with filtering
 * @access  Public
 */
app.get('/api/properties', async (req, res) => {
  try {
    const { 
      keyword, 
      location, 
      propertyType, 
      minPrice, 
      maxPrice, 
      environment,
      isDRAH,
      limit = 10,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {};

    // Keyword search (text search across multiple fields)
    if (keyword) {
      filter.$text = { $search: keyword };
    }

    // Location search
    if (location) {
      // Check if location is a zip code (5 digits)
      if (/^\d{5}$/.test(location)) {
        filter['location.zipCode'] = location;
      } else {
        // Search in city or state
        filter.$or = [
          { 'location.city': new RegExp(location, 'i') },
          { 'location.state': new RegExp(location, 'i') }
        ];
      }
    }

    // Property type filter
    if (propertyType) {
      filter.propertyType = propertyType;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Environment filter (real_world or metaverse)
    if (environment) {
      filter.environment = environment;
    }

    // DRAH filter
    if (isDRAH === 'true') {
      filter.isDRAH = true;
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Property.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: properties.length,
      total,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit))
      },
      data: properties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/properties/:id
 * @desc    Get property by ID
 * @access  Public
 */
app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/properties
 * @desc    Create a new property
 * @access  Private (would require auth middleware in production)
 */
app.post('/api/properties', async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    const savedProperty = await newProperty.save();
    
    return res.status(201).json({
      success: true,
      data: savedProperty
    });
  } catch (error) {
    console.error('Error creating property:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/properties/:id
 * @desc    Update a property
 * @access  Private (would require auth middleware in production)
 */
app.put('/api/properties/:id', async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: updatedProperty
    });
  } catch (error) {
    console.error('Error updating property:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete a property
 * @access  Private (would require auth middleware in production)
 */
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/properties/drah/:zipCode
 * @desc    Get DRAH properties by zip code
 * @access  Public
 */
app.get('/api/properties/drah/:zipCode', async (req, res) => {
  try {
    const properties = await Property.find({
      isDRAH: true,
      'location.zipCode': req.params.zipCode
    });
    
    return res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Error fetching DRAH properties:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/properties/nearby
 * @desc    Find properties near a location
 * @access  Public
 */
app.get('/api/properties/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10, limit = 10 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    // Convert radius from miles to meters (1 mile = 1609.34 meters)
    const radiusInMeters = Number(radius) * 1609.34;
    
    const properties = await Property.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: radiusInMeters
        }
      }
    }).limit(Number(limit));
    
    return res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('Error finding nearby properties:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Export the serverless function
module.exports.handler = serverless(app);
