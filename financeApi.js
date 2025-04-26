/**
 * Finance API - Serverless Functions
 * Handles all finance-related operations for the Multiverse Platform
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
const FinanceApplication = mongoose.model('FinanceApplication');
const User = mongoose.model('User');
const Property = mongoose.model('Property');

/**
 * @route   GET /api/finance/applications
 * @desc    Get all finance applications with filtering
 * @access  Private (would require auth middleware in production)
 */
app.get('/api/finance/applications', async (req, res) => {
  try {
    const { 
      status, 
      applicant, 
      property,
      loanType,
      limit = 10,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Applicant filter
    if (applicant) {
      filter.applicant = applicant;
    }

    // Property filter
    if (property) {
      filter.property = property;
    }

    // Loan type filter
    if (loanType) {
      filter.loanType = loanType;
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const applications = await FinanceApplication.find(filter)
      .populate('applicant', 'firstName lastName email ficoScore')
      .populate('property')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await FinanceApplication.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: applications.length,
      total,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit))
      },
      data: applications
    });
  } catch (error) {
    console.error('Error fetching finance applications:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/finance/applications/:id
 * @desc    Get finance application by ID
 * @access  Private (would require auth middleware in production)
 */
app.get('/api/finance/applications/:id', async (req, res) => {
  try {
    const application = await FinanceApplication.findById(req.params.id)
      .populate('applicant', 'firstName lastName email ficoScore')
      .populate('property')
      .populate('notes.author', 'firstName lastName');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Finance application not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching finance application:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/finance/applications
 * @desc    Create a new finance application
 * @access  Private (would require auth middleware in production)
 */
app.post('/api/finance/applications', async (req, res) => {
  try {
    const { applicantId, propertyId, ...applicationData } = req.body;
    
    // Check if applicant exists and is DRAH eligible
    const applicant = await User.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found'
      });
    }
    
    // Check FICO score eligibility (minimum 500)
    if (applicant.ficoScore < 500) {
      return res.status(400).json({
        success: false,
        message: 'Applicant does not meet minimum FICO score requirement of 500'
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
    }
    
    // Create new finance application
    const newApplication = new FinanceApplication({
      applicant: applicantId,
      property: propertyId,
      ficoScore: applicant.ficoScore,
      ...applicationData,
      hasPMI: false, // No PMI for DRAH Finance
      downPayment: 0, // No down payment for DRAH Finance
      status: 'submitted'
    });
    
    const savedApplication = await newApplication.save();
    
    // Add application to user's financeApplications
    applicant.financeApplications.push(savedApplication._id);
    await applicant.save();
    
    return res.status(201).json({
      success: true,
      data: savedApplication
    });
  } catch (error) {
    console.error('Error creating finance application:', error);
    
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
 * @route   PUT /api/finance/applications/:id
 * @desc    Update a finance application
 * @access  Private (would require auth middleware in production)
 */
app.put('/api/finance/applications/:id', async (req, res) => {
  try {
    const updatedApplication = await FinanceApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: 'Finance application not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: updatedApplication
    });
  } catch (error) {
    console.error('Error updating finance application:', error);
    
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
 * @route   POST /api/finance/applications/:id/documents
 * @desc    Add document to finance application
 * @access  Private (would require auth middleware in production)
 */
app.post('/api/finance/applications/:id/documents', async (req, res) => {
  try {
    const { name, type, url } = req.body;
    
    const application = await FinanceApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Finance application not found'
      });
    }
    
    application.documents.push({
      name,
      type,
      url,
      uploadDate: new Date(),
      verified: false
    });
    
    await application.save();
    
    return res.status(200).json({
      success: true,
      message: 'Document added successfully',
      data: application
    });
  } catch (error) {
    console.error('Error adding document:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/finance/applications/:id/notes
 * @desc    Add note to finance application
 * @access  Private (would require auth middleware in production)
 */
app.post('/api/finance/applications/:id/notes', async (req, res) => {
  try {
    const { content, authorId } = req.body;
    
    const application = await FinanceApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Finance application not found'
      });
    }
    
    application.notes.push({
      content,
      author: authorId,
      date: new Date()
    });
    
    await application.save();
    
    return res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: application
    });
  } catch (error) {
    console.error('Error adding note:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/finance/applications/:id/status
 * @desc    Update finance application status
 * @access  Private (would require auth middleware in production)
 */
app.put('/api/finance/applications/:id/status', async (req, res) => {
  try {
    const { status, denialReason } = req.body;
    
    const application = await FinanceApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Finance application not found'
      });
    }
    
    application.status = status;
    
    if (status === 'approved' || status === 'conditionally_approved') {
      application.approvalDate = new Date();
    }
    
    if (status === 'denied' && denialReason) {
      application.denialReason = denialReason;
    }
    
    await application.save();
    
    return res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/finance/applications/user/:userId
 * @desc    Get finance applications for a specific user
 * @access  Private (would require auth middleware in production)
 */
app.get('/api/finance/applications/user/:userId', async (req, res) => {
  try {
    const applications = await FinanceApplication.find({ applicant: req.params.userId })
      .populate('property')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching user finance applications:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/finance/calculate
 * @desc    Calculate mortgage payment
 * @access  Public
 */
app.post('/api/finance/calculate', async (req, res) => {
  try {
    const { loanAmount, interestRate, loanTerm, ficoScore } = req.body;
    
    // Check FICO score eligibility
    const isDRAHEligible = ficoScore >= 500;
    
    // Calculate monthly payment
    // Formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const payments = parseFloat(loanTerm) * 12;
    
    const x = Math.pow(1 + monthlyRate, payments);
    const monthlyPayment = (principal * x * monthlyRate) / (x - 1);
    
    // Calculate total payment
    const totalPayment = monthlyPayment * payments;
    
    return res.status(200).json({
      success: true,
      data: {
        isDRAHEligible,
        monthlyPayment: isFinite(monthlyPayment) ? monthlyPayment : 0,
        totalPayment: isFinite(totalPayment) ? totalPayment : 0,
        loanAmount: principal,
        interestRate: parseFloat(interestRate),
        loanTerm: parseInt(loanTerm),
        ficoScore: parseInt(ficoScore),
        downPayment: 0, // No down payment for DRAH Finance
        pmi: 0 // No PMI for DRAH Finance
      }
    });
  } catch (error) {
    console.error('Error calculating mortgage payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Export the serverless function
module.exports.handler = serverless(app);
