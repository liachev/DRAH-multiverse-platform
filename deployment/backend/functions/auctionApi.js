/**
 * Auction API - Serverless Functions
 * Handles all auction-related operations for the Multiverse Platform
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
const Auction = mongoose.model('Auction');
const Property = mongoose.model('Property');
const User = mongoose.model('User');

/**
 * @route   GET /api/auctions
 * @desc    Get all auctions with filtering
 * @access  Public
 */
app.get('/api/auctions', async (req, res) => {
  try {
    const { 
      status, 
      property, 
      isDRAH,
      limit = 10,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Property filter
    if (property) {
      filter.property = property;
    }

    // DRAH filter
    if (isDRAH === 'true') {
      filter.isDRAH = true;
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const auctions = await Auction.find(filter)
      .populate('property')
      .sort({ endDate: 1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Auction.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: auctions.length,
      total,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit))
      },
      data: auctions
    });
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/auctions/:id
 * @desc    Get auction by ID
 * @access  Public
 */
app.get('/api/auctions/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('property')
      .populate('bids.bidder', 'firstName lastName email')
      .populate('deposits.user', 'firstName lastName email')
      .populate('winner', 'firstName lastName email');
    
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: auction
    });
  } catch (error) {
    console.error('Error fetching auction:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auctions
 * @desc    Create a new auction
 * @access  Private (would require auth middleware in production)
 */
app.post('/api/auctions', async (req, res) => {
  try {
    // Check if property exists
    const property = await Property.findById(req.body.property);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Create new auction
    const newAuction = new Auction({
      ...req.body,
      isDRAH: property.isDRAH // Set isDRAH based on property
    });
    
    const savedAuction = await newAuction.save();
    
    // Update property status to 'auction'
    await Property.findByIdAndUpdate(property._id, { status: 'auction' });
    
    return res.status(201).json({
      success: true,
      data: savedAuction
    });
  } catch (error) {
    console.error('Error creating auction:', error);
    
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
 * @route   POST /api/auctions/:id/deposit
 * @desc    Place a deposit on an auction
 * @access  Private (would require auth middleware in production)
 */
app.post('/api/auctions/:id/deposit', async (req, res) => {
  try {
    const { userId, amount = 850, transactionId } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if auction exists and is in the right state
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }
    
    if (auction.status !== 'upcoming' && auction.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Deposits can only be placed on upcoming or active auctions'
      });
    }
    
    // Check if user already has a deposit
    const existingDeposit = auction.deposits.find(
      deposit => deposit.user.toString() === userId
    );
    
    if (existingDeposit) {
      return res.status(400).json({
        success: false,
        message: 'User already has a deposit on this auction'
      });
    }
    
    // Add deposit
    auction.deposits.push({
      user: userId,
      amount,
      timestamp: new Date(),
      status: 'confirmed', // In a real app, this would be 'pending' until payment is confirmed
      transactionId
    });
    
    // Add auction to user's activeAuctions
    if (!user.activeAuctions.includes(auction._id)) {
      user.activeAuctions.push(auction._id);
      await user.save();
    }
    
    // Save auction
    await auction.save();
    
    return res.status(200).json({
      success: true,
      message: 'Deposit placed successfully',
      data: auction
    });
  } catch (error) {
    console.error('Error placing deposit:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auctions/:id/bid
 * @desc    Place a bid on an auction
 * @access  Private (would require auth middleware in production)
 */
app.post('/api/auctions/:id/bid', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if auction exists and is active
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }
    
    if (auction.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Bids can only be placed on active auctions'
      });
    }
    
    // Check if user has placed a deposit
    const hasDeposit = auction.deposits.some(
      deposit => deposit.user.toString() === userId && deposit.status === 'confirmed'
    );
    
    if (!hasDeposit) {
      return res.status(400).json({
        success: false,
        message: 'A deposit is required before placing a bid'
      });
    }
    
    // Check if bid amount is valid
    const minimumBid = auction.currentBid > 0 ? auction.currentBid + 100 : auction.startingBid;
    
    if (amount < minimumBid) {
      return res.status(400).json({
        success: false,
        message: `Bid must be at least ${minimumBid}`
      });
    }
    
    // Update previous winning bid
    if (auction.bids.length > 0) {
      auction.bids.forEach(bid => {
        bid.isWinning = false;
      });
    }
    
    // Add new bid
    auction.bids.push({
      bidder: userId,
      amount,
      timestamp: new Date(),
      isWinning: true
    });
    
    // Update current bid
    auction.currentBid = amount;
    
    // Save auction
    await auction.save();
    
    return res.status(200).json({
      success: true,
      message: 'Bid placed successfully',
      data: auction
    });
  } catch (error) {
    console.error('Error placing bid:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/auctions/:id/end
 * @desc    End an auction and determine winner
 * @access  Private (would require auth middleware in production)
 */
app.put('/api/auctions/:id/end', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }
    
    if (auction.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Only active auctions can be ended'
      });
    }
    
    // Find winning bid
    const winningBid = auction.bids.find(bid => bid.isWinning);
    
    if (winningBid) {
      auction.winner = winningBid.bidder;
      auction.winningBid = winningBid.amount;
      
      // Set payment due date (24 hours from now)
      const paymentDue = new Date();
      paymentDue.setHours(paymentDue.getHours() + 24);
      auction.paymentDue = paymentDue;
    }
    
    auction.status = 'ended';
    await auction.save();
    
    // Update property status
    if (winningBid) {
      await Property.findByIdAndUpdate(auction.property, { status: 'pending' });
    } else {
      await Property.findByIdAndUpdate(auction.property, { status: 'available' });
    }
    
    return res.status(200).json({
      success: true,
      message: winningBid ? 'Auction ended with a winner' : 'Auction ended with no bids',
      data: auction
    });
  } catch (error) {
    console.error('Error ending auction:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/auctions/:id/complete-payment
 * @desc    Complete payment for a won auction
 * @access  Private (would require auth middleware in production)
 */
app.put('/api/auctions/:id/complete-payment', async (req, res) => {
  try {
    const { userId, transactionId } = req.body;
    
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
    }
    
    if (auction.status !== 'ended') {
      return res.status(400).json({
        success: false,
        message: 'Payment can only be completed for ended auctions'
      });
    }
    
    if (!auction.winner || auction.winner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the auction winner can complete payment'
      });
    }
    
    // Update auction status
    auction.status = 'completed';
    auction.paymentStatus = 'completed';
    await auction.save();
    
    // Update property status
    await Property.findByIdAndUpdate(auction.property, { 
      status: 'sold',
      createdBy: userId // Transfer ownership
    });
    
    // Update user's purchased properties
    await User.findByIdAndUpdate(userId, {
      $push: {
        purchasedProperties: {
          property: auction.property,
          purchaseDate: new Date(),
          purchasePrice: auction.winningBid,
          purchaseMethod: 'auction'
        }
      }
    });
    
    // Apply deposit to payment (in a real app, this would involve payment processing)
    const userDeposit = auction.deposits.find(
      deposit => deposit.user.toString() === userId
    );
    
    if (userDeposit) {
      userDeposit.status = 'applied';
      await auction.save();
    }
    
    return res.status(200).json({
      success: true,
      message: 'Payment completed successfully',
      data: auction
    });
  } catch (error) {
    console.error('Error completing payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/auctions/property/:propertyId
 * @desc    Get auctions for a specific property
 * @access  Public
 */
app.get('/api/auctions/property/:propertyId', async (req, res) => {
  try {
    const auctions = await Auction.find({ property: req.params.propertyId })
      .sort({ endDate: -1 });
    
    return res.status(200).json({
      success: true,
      count: auctions.length,
      data: auctions
    });
  } catch (error) {
    console.error('Error fetching property auctions:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/auctions/user/:userId
 * @desc    Get auctions for a specific user
 * @access  Private (would require auth middleware in production)
 */
app.get('/api/auctions/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get auctions where user has placed deposits
    const auctions = await Auction.find({
      'deposits.user': req.params.userId
    }).populate('property');
    
    return res.status(200).json({
      success: true,
      count: auctions.length,
      data: auctions
    });
  } catch (error) {
    console.error('Error fetching user auctions:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Export the serverless function
module.exports.handler = serverless(app);
