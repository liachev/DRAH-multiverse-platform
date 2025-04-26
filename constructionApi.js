/**
 * Construction API - Serverless Functions
 * Handles all construction service operations for the Multiverse Platform
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

// Load models
const ConstructionService = mongoose.model('ConstructionService');
const User = mongoose.model('User');
const Property = mongoose.model('Property');

/**
 * @route   GET /api/construction/services
 * @desc    Get all construction service requests with filtering
 * @access  Private (would require auth middleware in production)
 */
app.get('/api/construction/services', async (req, res) => {
  try {
    const { 
      status, 
      client, 
      property,
      packageType,
      limit = 10,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Client filter
    if (client) {
      filter.client = client;
    }

    // Property filter
    if (property) {
      filter.property = property;
    }

    // Package type filter
    if (packageType) {
      filter.packageType = packageType;
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const services = await ConstructionService.find(filter)
      .populate('client', 'firstName lastName email')
      .populate('property')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await ConstructionService.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: services.length,
      total,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit))
      },
      data: services
    });
  } catch (error) {
    console.error('Error fetching construction services:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/construction/services/:id
 * @desc    Get construction service by ID
 * @access  Private (would require auth middleware in production)
 */
app.get('/api/construction/services/:id', async (req, res) => {
  try {
    const service = await ConstructionService.findById(req.params.id)
      .populate('client', 'firstName lastName email')
      .populate('property')
      .populate('assignedContractor', 'firstName lastName email')
      .populate('updates.author', 'firstName lastName');
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Construction service not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching construction service:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/construction/services
 * @desc    Create a new construction service request
 * @access  Private (would require auth middleware in production)
 */
app.post('/api/construction/services', async (req, res) => {
  try {
    const { clientId, propertyId, ...serviceData } = req.body;
    
    // Check if client exists
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    // Check if property exists if provided
    let property = null;
    if (propertyId) {
      property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }
      
      // Check if property is DRAH eligible
      if (property.isDRAH === false) {
        return res.status(400).json({
          success: false,
          message: 'Property is not DRAH eligible for construction services'
        });
      }
    }
    
    // Calculate costs
    const { 
      packageType = 'standard', 
      squareFootage = 0, 
      features = {},
      bedrooms = 3,
      bathrooms = 2,
      stories = 1
    } = serviceData;
    
    // Price per square foot based on package type
    const pricePerSqFt = {
      standard: 175,
      premium: 225,
      custom: 275
    };
    
    // Calculate base price
    const basePrice = squareFootage * pricePerSqFt[packageType];
    
    // Calculate additional costs for features
    let additionalCost = 0;
    
    if (features.garage) additionalCost += 25000;
    if (features.porch) additionalCost += 15000;
    if (features.smartHome) additionalCost += 10000;
    
    // Bedrooms and bathrooms beyond base (3 bed, 2 bath)
    if (bedrooms > 3) additionalCost += (bedrooms - 3) * 10000;
    if (bathrooms > 2) additionalCost += (bathrooms - 2) * 15000;
    
    // Additional story
    if (stories > 1) additionalCost += squareFootage * 50;
    
    // Calculate total price with 10% DRAH savings
    const marketPrice = basePrice + additionalCost;
    const totalPrice = marketPrice * 0.9; // 10% discount
    const savings = marketPrice - totalPrice;
    
    // Create new construction service request
    const newService = new ConstructionService({
      client: clientId,
      property: propertyId,
      ...serviceData,
      basePrice,
      additionalCost,
      marketPrice,
      totalPrice,
      savings,
      status: 'submitted'
    });
    
    const savedService = await newService.save();
    
    // Add service to user's constructionServices
    client.constructionServices.push(savedService._id);
    await client.save();
    
    return res.status(201).json({
      success: true,
      data: savedService
    });
  } catch (error) {
    console.error('Error creating construction service:', error);
    
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
 * @route   PUT /api/construction/services/:id
 * @desc    Update a construction service
 * @access  Private (would require auth middleware in production)
 */
app.put('/api/construction/services/:id', async (req, res) => {
  try {
    const updatedService = await ConstructionService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: 'Construction service not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: updatedService
    });
  } catch (error) {
    console.error('Error updating construction service:', error);
    
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
 * @route   POST /api/construction/services/:id/updates
 * @desc    Add update to construction service
 * @access  Private (would require auth middleware in production)
 */
app.post('/api/construction/services/:id/updates', async (req, res) => {
  try {
    const { content, authorId, milestone } = req.body;
    
    const service = await ConstructionService.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Construction service not found'
      });
    }
    
    const update = {
      content,
      author: authorId,
      date: new Date()
    };
    
    if (milestone) {
      update.milestone = milestone;
    }
    
    service.updates.push(update);
    
    await service.save();
    
    return res.status(200).json({
      success: true,
      message: 'Update added successfully',
      data: service
    });
  } catch (error) {
    console.error('Error adding update:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/construction/services/:id/status
 * @desc    Update construction service status
 * @access  Private (would require auth middleware in production)
 */
app.put('/api/construction/services/:id/status', async (req, res) => {
  try {
    const { status, assignedContractorId } = req.body;
    
    const service = await ConstructionService.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Construction service not found'
      });
    }
    
    service.status = status;
    
    if (status === 'approved' && assignedContractorId) {
      service.assignedContractor = assignedContractorId;
      service.approvalDate = new Date();
    }
    
    if (status === 'completed') {
      service.completionDate = new Date();
    }
    
    await service.save();
    
    return res.status(200).json({
      success: true,
      message: `Service status updated to ${status}`,
      data: service
    });
  } catch (error) {
    console.error('Error updating service status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/construction/services/user/:userId
 * @desc    Get construction services for a specific user
 * @access  Private (would require auth middleware in production)
 */
app.get('/api/construction/services/user/:userId', async (req, res) => {
  try {
    const services = await ConstructionService.find({ client: req.params.userId })
      .populate('property')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Error fetching user construction services:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/construction/calculate
 * @desc    Calculate construction costs
 * @access  Public
 */
app.post('/api/construction/calculate', async (req, res) => {
  try {
    const { 
      packageType = 'standard', 
      squareFootage = 1800, 
      features = {},
      bedrooms = 3,
      bathrooms = 2,
      stories = 1
    } = req.body;
    
    // Price per square foot based on package type
    const pricePerSqFt = {
      standard: 175,
      premium: 225,
      custom: 275
    };
    
    // Calculate base price
    const basePrice = squareFootage * pricePerSqFt[packageType];
    
    // Calculate additional costs for features
    let additionalCost = 0;
    
    if (features.garage) additionalCost += 25000;
    if (features.porch) additionalCost += 15000;
    if (features.smartHome) additionalCost += 10000;
    
    // Bedrooms and bathrooms beyond base (3 bed, 2 bath)
    if (bedrooms > 3) additionalCost += (bedrooms - 3) * 10000;
    if (bathrooms > 2) additionalCost += (bathrooms - 2) * 15000;
    
    // Additional story
    if (stories > 1) additionalCost += squareFootage * 50;
    
    // Calculate total price with 10% DRAH savings
    const marketPrice = basePrice + additionalCost;
    const totalPrice = marketPrice * 0.9; // 10% discount
    const savings = marketPrice - totalPrice;
    
    return res.status(200).json({
      success: true,
      data: {
        packageType,
        squareFootage,
        features,
        bedrooms,
        bathrooms,
        stories,
        basePrice,
        additionalCost,
        marketPrice,
        totalPrice,
        savings,
        pricePerSqFt: pricePerSqFt[packageType]
      }
    });
  } catch (error) {
    console.error('Error calculating construction costs:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Export the serverless function
module.exports.handler = serverless(app);
