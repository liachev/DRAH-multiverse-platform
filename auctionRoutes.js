const express = require('express');
const router = express.Router();
const Auction = require('../../models/Auction');
const Property = require('../../models/Property');

// Get all auctions with filtering options
router.get('/', async (req, res) => {
  try {
    const {
      status,
      propertyType,
      minPrice,
      maxPrice,
      isBundle,
      limit = 10,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (isBundle) filter.isBundle = isBundle === 'true';
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query with pagination and populate property details
    const auctions = await Auction.find(filter)
      .populate('property')
      .skip(skip)
      .limit(Number(limit))
      .sort({ startDate: 1 });
    
    // Filter by property type and price if specified
    let filteredAuctions = auctions;
    
    if (propertyType || minPrice || maxPrice) {
      filteredAuctions = auctions.filter(auction => {
        const property = auction.property;
        
        if (!property) return false;
        
        if (propertyType && property.type !== propertyType) return false;
        
        if (minPrice && auction.currentPrice < Number(minPrice)) return false;
        
        if (maxPrice && auction.currentPrice > Number(maxPrice)) return false;
        
        return true;
      });
    }
    
    // Get total count for pagination
    const total = await Auction.countDocuments(filter);
    
    res.json({
      auctions: filteredAuctions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching auctions:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get auction by ID
router.get('/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('property')
      .populate('bids.bidder', 'username email profileImage')
      .populate('deposits.user', 'username email profileImage')
      .populate('winner.user', 'username email profileImage')
      .populate('createdBy', 'username email profileImage');
    
    if (!auction) {
      return res.status(404).json({ error: true, message: 'Auction not found' });
    }
    
    res.json(auction);
  } catch (err) {
    console.error('Error fetching auction:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Create new auction
router.post('/', async (req, res) => {
  try {
    const { propertyId, startingPrice, depositAmount, startDate, endDate, isBundle, bundledPropertyIds } = req.body;
    
    // Validate property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }
    
    // Create new auction
    const newAuction = new Auction({
      property: propertyId,
      startingPrice,
      currentPrice: startingPrice,
      depositAmount: depositAmount || 850, // Default from CivicSource research
      startDate,
      endDate,
      status: new Date(startDate) > new Date() ? 'pending' : 'active',
      createdBy: req.body.userId, // This should come from authenticated user
      isBundle: isBundle || false
    });
    
    // Add bundled properties if it's a bundle
    if (isBundle && bundledPropertyIds && bundledPropertyIds.length > 0) {
      newAuction.bundledProperties = bundledPropertyIds;
    }
    
    const savedAuction = await newAuction.save();
    
    // Update property status to auction
    await Property.findByIdAndUpdate(propertyId, { status: 'auction' });
    
    res.status(201).json(savedAuction);
  } catch (err) {
    console.error('Error creating auction:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Place deposit on auction
router.post('/:id/deposit', async (req, res) => {
  try {
    const { userId, amount, transactionId } = req.body;
    
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ error: true, message: 'Auction not found' });
    }
    
    if (auction.status !== 'active') {
      return res.status(400).json({ error: true, message: 'Auction is not active' });
    }
    
    // Check if user already placed a deposit
    const existingDeposit = auction.deposits.find(
      deposit => deposit.user.toString() === userId && ['confirmed', 'applied'].includes(deposit.status)
    );
    
    if (existingDeposit) {
      return res.status(400).json({ error: true, message: 'User already placed a deposit' });
    }
    
    // Place deposit
    await auction.placeDeposit(userId, amount, transactionId);
    
    res.json({ message: 'Deposit placed successfully', auction });
  } catch (err) {
    console.error('Error placing deposit:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Place bid on auction
router.post('/:id/bid', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ error: true, message: 'Auction not found' });
    }
    
    if (auction.status !== 'active') {
      return res.status(400).json({ error: true, message: 'Auction is not active' });
    }
    
    // Place bid
    try {
      await auction.placeBid(userId, amount);
      res.json({ message: 'Bid placed successfully', auction });
    } catch (bidError) {
      res.status(400).json({ error: true, message: bidError.message });
    }
  } catch (err) {
    console.error('Error placing bid:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// End auction
router.post('/:id/end', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ error: true, message: 'Auction not found' });
    }
    
    if (auction.status !== 'active') {
      return res.status(400).json({ error: true, message: 'Only active auctions can be ended' });
    }
    
    // End auction
    await auction.endAuction();
    
    // Update property status if there's a winner
    if (auction.winner && auction.winner.user) {
      await Property.findByIdAndUpdate(auction.property, { status: 'pending' });
    } else {
      await Property.findByIdAndUpdate(auction.property, { status: 'available' });
    }
    
    res.json({ message: 'Auction ended successfully', auction });
  } catch (err) {
    console.error('Error ending auction:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get active auctions
router.get('/status/active', async (req, res) => {
  try {
    const activeAuctions = await Auction.find({ status: 'active' })
      .populate('property')
      .sort({ endDate: 1 });
    
    res.json(activeAuctions);
  } catch (err) {
    console.error('Error fetching active auctions:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get auctions by user (created, bid, or deposit)
router.get('/user/:userId', async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    const userId = req.params.userId;
    
    let filter = {};
    
    switch (type) {
      case 'created':
        filter = { createdBy: userId };
        break;
      case 'bid':
        filter = { 'bids.bidder': userId };
        break;
      case 'deposit':
        filter = { 'deposits.user': userId };
        break;
      case 'won':
        filter = { 'winner.user': userId };
        break;
      default:
        filter = {
          $or: [
            { createdBy: userId },
            { 'bids.bidder': userId },
            { 'deposits.user': userId },
            { 'winner.user': userId }
          ]
        };
    }
    
    const auctions = await Auction.find(filter)
      .populate('property')
      .sort({ createdAt: -1 });
    
    res.json(auctions);
  } catch (err) {
    console.error('Error fetching user auctions:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

module.exports = router;
