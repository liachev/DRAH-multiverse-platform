const express = require('express');
const router = express.Router();
const Auction = require('../models/Auction');

// GET all auctions
router.get('/', async (req, res) => {
  try {
    const { propertyType, environment, minPrice, maxPrice, isDRAH, status, propertyId } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (propertyId) {
      filter['property._id'] = propertyId;
    }
    
    if (propertyType) {
      filter['property.propertyType'] = propertyType;
    }
    
    if (environment) {
      filter['property.environment'] = environment;
    }
    
    if (minPrice) {
      filter.currentBid = { ...filter.currentBid, $gte: parseInt(minPrice) };
    }
    
    if (maxPrice) {
      filter.currentBid = { ...filter.currentBid, $lte: parseInt(maxPrice) };
    }
    
    if (isDRAH === 'true') {
      filter.isDRAH = true;
    }
    
    if (status) {
      filter.status = status;
    }
    
    const auctions = await Auction.find(filter);
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET auction by ID
router.get('/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new auction
router.post('/', async (req, res) => {
  try {
    const auction = new Auction(req.body);
    const savedAuction = await auction.save();
    res.status(201).json(savedAuction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update auction
router.put('/:id', async (req, res) => {
  try {
    const updatedAuction = await Auction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedAuction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    res.json(updatedAuction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE auction
router.delete('/:id', async (req, res) => {
  try {
    const deletedAuction = await Auction.findByIdAndDelete(req.params.id);
    
    if (!deletedAuction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST place deposit
router.post('/:id/deposit', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || !amount) {
      return res.status(400).json({ message: 'User ID and amount are required' });
    }
    
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'Auction is not active' });
    }
    
    // Check if user already placed a deposit
    const existingDeposit = auction.deposits.find(deposit => deposit.user._id.toString() === userId);
    
    if (existingDeposit) {
      return res.status(400).json({ message: 'User already placed a deposit for this auction' });
    }
    
    // Add deposit
    auction.deposits.push({
      user: { _id: userId },
      amount,
      timestamp: new Date(),
      status: 'pending'
    });
    
    const updatedAuction = await auction.save();
    res.json(updatedAuction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST place bid
router.post('/:id/bid', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || !amount) {
      return res.status(400).json({ message: 'User ID and amount are required' });
    }
    
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'Auction is not active' });
    }
    
    // Check if user placed a deposit
    const userDeposit = auction.deposits.find(deposit => deposit.user._id.toString() === userId);
    
    if (!userDeposit || userDeposit.status !== 'confirmed') {
      return res.status(400).json({ message: 'User must place a confirmed deposit before bidding' });
    }
    
    // Check if bid amount is higher than current bid
    if (amount <= auction.currentBid) {
      return res.status(400).json({ message: 'Bid amount must be higher than current bid' });
    }
    
    // Update all bids to not be winning
    auction.bids.forEach(bid => {
      bid.isWinning = false;
    });
    
    // Add new bid
    auction.bids.push({
      bidder: { _id: userId },
      amount,
      timestamp: new Date(),
      isWinning: true
    });
    
    // Update current bid
    auction.currentBid = amount;
    
    const updatedAuction = await auction.save();
    res.json(updatedAuction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT end auction
router.put('/:id/end', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'Auction is not active' });
    }
    
    // End auction
    auction.status = 'ended';
    auction.endDate = new Date();
    
    const updatedAuction = await auction.save();
    res.json(updatedAuction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET active auctions
router.get('/filter/active', async (req, res) => {
  try {
    const auctions = await Auction.find({ status: 'active' });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ended auctions
router.get('/filter/ended', async (req, res) => {
  try {
    const auctions = await Auction.find({ status: 'ended' });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET DRAH auctions
router.get('/filter/drah', async (req, res) => {
  try {
    const auctions = await Auction.find({ isDRAH: true });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
