const express = require('express');
const router = express.Router();
const Auction = require('../../models/Auction');
const Property = require('../../models/Property');
const User = require('../../models/User');

// Create auction for property
router.post('/create', async (req, res) => {
  try {
    const { 
      propertyId, 
      startingPrice, 
      depositAmount = 850, // Default from CivicSource research
      startDate, 
      endDate, 
      isBundle, 
      bundledPropertyIds,
      userId 
    } = req.body;
    
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
      depositAmount,
      startDate,
      endDate,
      status: new Date(startDate) > new Date() ? 'pending' : 'active',
      createdBy: userId,
      isBundle: isBundle || false
    });
    
    // Add bundled properties if it's a bundle
    if (isBundle && bundledPropertyIds && bundledPropertyIds.length > 0) {
      newAuction.bundledProperties = bundledPropertyIds;
    }
    
    const savedAuction = await newAuction.save();
    
    // Update property status to auction
    await Property.findByIdAndUpdate(propertyId, { status: 'auction' });
    
    // Update user's auctions
    await User.findByIdAndUpdate(userId, {
      $push: { auctions: savedAuction._id }
    });
    
    res.status(201).json({
      message: 'Auction created successfully',
      auction: savedAuction
    });
  } catch (err) {
    console.error('Error creating auction:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Process deposit for auction (Step 2 of CivicSource process)
router.post('/deposit', async (req, res) => {
  try {
    const { auctionId, userId, amount, paymentMethod, transactionId } = req.body;
    
    const auction = await Auction.findById(auctionId);
    
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
    
    // Process payment (this would integrate with a payment gateway in production)
    const paymentSuccessful = true; // Simulated payment processing
    
    if (!paymentSuccessful) {
      return res.status(400).json({ error: true, message: 'Payment processing failed' });
    }
    
    // Place deposit
    auction.deposits.push({
      user: userId,
      amount: amount || auction.depositAmount,
      transactionId,
      status: 'confirmed',
      timestamp: new Date()
    });
    
    await auction.save();
    
    // Update user's deposits
    await User.findByIdAndUpdate(userId, {
      $push: { 
        deposits: {
          auction: auctionId,
          amount: amount || auction.depositAmount,
          status: 'confirmed',
          date: new Date()
        } 
      }
    });
    
    res.json({
      message: 'Deposit placed successfully',
      auction
    });
  } catch (err) {
    console.error('Error processing deposit:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Place bid on auction
router.post('/bid', async (req, res) => {
  try {
    const { auctionId, userId, amount } = req.body;
    
    const auction = await Auction.findById(auctionId);
    
    if (!auction) {
      return res.status(404).json({ error: true, message: 'Auction not found' });
    }
    
    if (auction.status !== 'active') {
      return res.status(400).json({ error: true, message: 'Auction is not active' });
    }
    
    // Check if user has placed a deposit
    const hasDeposit = auction.deposits.some(deposit => 
      deposit.user.toString() === userId.toString() && 
      ['confirmed', 'applied'].includes(deposit.status)
    );
    
    if (!hasDeposit) {
      return res.status(400).json({ error: true, message: 'User must place a deposit before bidding' });
    }
    
    // Check if bid amount is higher than current price
    if (amount <= auction.currentPrice) {
      return res.status(400).json({ error: true, message: 'Bid amount must be higher than current price' });
    }
    
    // Update previous winning bid to outbid
    auction.bids.forEach(bid => {
      if (bid.status === 'winning') {
        bid.status = 'outbid';
      }
    });
    
    // Add new bid
    auction.bids.push({
      bidder: userId,
      amount,
      status: 'winning',
      timestamp: new Date()
    });
    
    auction.currentPrice = amount;
    
    await auction.save();
    
    // Update user's bids
    await User.findByIdAndUpdate(userId, {
      $push: { bids: auctionId }
    });
    
    res.json({
      message: 'Bid placed successfully',
      auction
    });
  } catch (err) {
    console.error('Error placing bid:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// End auction automatically (scheduled task)
router.post('/end/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ error: true, message: 'Auction not found' });
    }
    
    if (auction.status !== 'active') {
      return res.status(400).json({ error: true, message: 'Only active auctions can be ended' });
    }
    
    // End auction
    auction.status = 'ended';
    
    // Find winning bid
    const winningBid = auction.bids.find(bid => bid.status === 'winning');
    
    if (winningBid) {
      auction.winner = {
        user: winningBid.bidder,
        bid: winningBid._id,
        paymentStatus: 'pending',
        paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      };
      
      // Apply deposit to winner's payment
      const winnerDeposit = auction.deposits.find(deposit => 
        deposit.user.toString() === winningBid.bidder.toString() &&
        deposit.status === 'confirmed'
      );
      
      if (winnerDeposit) {
        winnerDeposit.status = 'applied';
      }
    } else {
      // No bids, revert property status
      await Property.findByIdAndUpdate(auction.property, { status: 'available' });
    }
    
    await auction.save();
    
    res.json({
      message: 'Auction ended successfully',
      auction
    });
  } catch (err) {
    console.error('Error ending auction:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Complete auction payment (Step 3 of CivicSource process)
router.post('/complete-payment', async (req, res) => {
  try {
    const { auctionId, userId, paymentMethod, transactionId } = req.body;
    
    const auction = await Auction.findById(auctionId);
    
    if (!auction) {
      return res.status(404).json({ error: true, message: 'Auction not found' });
    }
    
    if (auction.status !== 'ended') {
      return res.status(400).json({ error: true, message: 'Only ended auctions can be completed' });
    }
    
    if (!auction.winner || !auction.winner.user) {
      return res.status(400).json({ error: true, message: 'Auction has no winner' });
    }
    
    if (auction.winner.user.toString() !== userId) {
      return res.status(403).json({ error: true, message: 'Only the auction winner can complete payment' });
    }
    
    if (auction.winner.paymentStatus === 'completed') {
      return res.status(400).json({ error: true, message: 'Payment already completed' });
    }
    
    // Check if payment deadline has passed
    if (new Date() > new Date(auction.winner.paymentDeadline)) {
      return res.status(400).json({ error: true, message: 'Payment deadline has passed' });
    }
    
    // Process payment (this would integrate with a payment gateway in production)
    const paymentSuccessful = true; // Simulated payment processing
    
    if (!paymentSuccessful) {
      return res.status(400).json({ error: true, message: 'Payment processing failed' });
    }
    
    // Update auction
    auction.winner.paymentStatus = 'completed';
    await auction.save();
    
    // Update property status and owner
    await Property.findByIdAndUpdate(auction.property, { 
      status: 'sold',
      owner: userId
    });
    
    // Update user's properties
    await User.findByIdAndUpdate(userId, {
      $push: { properties: auction.property }
    });
    
    res.json({
      message: 'Payment completed successfully',
      auction
    });
  } catch (err) {
    console.error('Error completing payment:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Get active auctions with filtering
router.get('/active', async (req, res) => {
  try {
    const {
      propertyType,
      minPrice,
      maxPrice,
      location,
      isForDRAH,
      limit = 10,
      page = 1
    } = req.query;
    
    // Find active auctions
    const auctionsQuery = Auction.find({ status: 'active' })
      .populate('property')
      .populate('bids.bidder', 'username email profileImage')
      .sort({ endDate: 1 });
    
    // Apply pagination
    const skip = (Number(page) - 1) * Number(limit);
    auctionsQuery.skip(skip).limit(Number(limit));
    
    const auctions = await auctionsQuery.exec();
    
    // Filter by property attributes
    let filteredAuctions = auctions;
    
    if (propertyType || minPrice || maxPrice || location || isForDRAH) {
      filteredAuctions = auctions.filter(auction => {
        const property = auction.property;
        
        if (!property) return false;
        
        if (propertyType && property.type !== propertyType) return false;
        
        if (minPrice && auction.currentPrice < Number(minPrice)) return false;
        
        if (maxPrice && auction.currentPrice > Number(maxPrice)) return false;
        
        if (location) {
          const locationMatch = 
            property.location.city?.includes(location) || 
            property.location.zipCode?.includes(location) ||
            property.location.state?.includes(location);
          
          if (!locationMatch) return false;
        }
        
        if (isForDRAH === 'true' && !property.isForDRAH) return false;
        
        return true;
      });
    }
    
    // Get total count for pagination
    const total = await Auction.countDocuments({ status: 'active' });
    
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
    console.error('Error fetching active auctions:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get auction details with property and bidding history
router.get('/details/:id', async (req, res) => {
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
    
    // Get similar properties
    const similarProperties = await Property.find({
      _id: { $ne: auction.property._id },
      type: auction.property.type,
      status: 'auction',
      'location.city': auction.property.location.city
    }).limit(3);
    
    // Get city resources for the property
    let cityResources = [];
    if (auction.property && auction.property.resources) {
      cityResources = auction.property.resources;
    }
    
    res.json({
      auction,
      similarProperties,
      cityResources
    });
  } catch (err) {
    console.error('Error fetching auction details:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get user's auction activity
router.get('/user-activity/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's deposits
    const depositsQuery = Auction.find({
      'deposits.user': userId
    }).populate('property');
    
    // Get user's bids
    const bidsQuery = Auction.find({
      'bids.bidder': userId
    }).populate('property');
    
    // Get user's won auctions
    const wonAuctionsQuery = Auction.find({
      'winner.user': userId
    }).populate('property');
    
    // Execute queries in parallel
    const [deposits, bids, wonAuctions] = await Promise.all([
      depositsQuery.exec(),
      bidsQuery.exec(),
      wonAuctionsQuery.exec()
    ]);
    
    res.json({
      deposits,
      bids,
      wonAuctions
    });
  } catch (err) {
    console.error('Error fetching user auction activity:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get DRAH auctions
router.get('/drah', async (req, res) => {
  try {
    const { zipCode, city, limit = 10, page = 1 } = req.query;
    
    // Build filter for DRAH properties
    const propertyFilter = { isForDRAH: true };
    
    if (zipCode) {
      propertyFilter['location.zipCode'] = zipCode;
    }
    
    if (city) {
      propertyFilter['location.city'] = { $regex: city, $options: 'i' };
    }
    
    // Find DRAH properties
    const drahProperties = await Property.find(propertyFilter).select('_id');
    const drahPropertyIds = drahProperties.map(p => p._id);
    
    // Find auctions for DRAH properties
    const auctionsQuery = Auction.find({
      property: { $in: drahPropertyIds },
      status: 'active'
    })
    .populate('property')
    .sort({ endDate: 1 });
    
    // Apply pagination
    const skip = (Number(page) - 1) * Number(limit);
    auctionsQuery.skip(skip).limit(Number(limit));
    
    const auctions = await auctionsQuery.exec();
    
    // Get total count for pagination
    const total = await Auction.countDocuments({
      property: { $in: drahPropertyIds },
      status: 'active'
    });
    
    res.json({
      auctions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching DRAH auctions:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Create property bundle for auction
router.post('/create-bundle', async (req, res) => {
  try {
    const { propertyIds, name, description, startingPrice, depositAmount, startDate, endDate, userId } = req.body;
    
    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length < 2) {
      return res.status(400).json({ error: true, message: 'At least two properties are required for a bundle' });
    }
    
    // Validate properties exist
    const properties = await Property.find({ _id: { $in: propertyIds } });
    
    if (properties.length !== propertyIds.length) {
      return res.status(404).json({ error: true, message: 'One or more properties not found' });
    }
    
    // Check if properties are available
    const unavailableProperties = properties.filter(p => p.status !== 'available');
    
    if (unavailableProperties.length > 0) {
      return res.status(400).json({ 
        error: true, 
        message: 'One or more properties are not available for auction',
        unavailableProperties
      });
    }
    
    // Create new auction with bundle
    con
(Content truncated due to size limit. Use line ranges to read in chunks)