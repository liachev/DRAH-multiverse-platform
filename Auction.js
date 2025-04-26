const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuctionSchema = new Schema({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  startingPrice: {
    type: Number,
    required: true
  },
  currentPrice: {
    type: Number,
    default: function() {
      return this.startingPrice;
    }
  },
  depositAmount: {
    type: Number,
    required: true,
    default: 850 // Default deposit amount based on CivicSource research
  },
  currency: {
    type: String,
    enum: ['USD', 'ETH', 'BTC'],
    default: 'USD'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'ended', 'cancelled'],
    default: 'pending'
  },
  bids: [{
    bidder: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'winning', 'outbid', 'cancelled'],
      default: 'active'
    }
  }],
  deposits: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    transactionId: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'refunded', 'applied'],
      default: 'pending'
    }
  }],
  winner: {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    bid: {
      type: Schema.Types.ObjectId
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    paymentDeadline: {
      type: Date
    }
  },
  isBundle: {
    type: Boolean,
    default: false
  },
  bundledProperties: [{
    type: Schema.Types.ObjectId,
    ref: 'Property'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient querying
AuctionSchema.index({ status: 1 });
AuctionSchema.index({ startDate: 1 });
AuctionSchema.index({ endDate: 1 });
AuctionSchema.index({ property: 1 });
AuctionSchema.index({ 'bids.bidder': 1 });
AuctionSchema.index({ 'deposits.user': 1 });

// Update the updatedAt field on save
AuctionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to place a deposit
AuctionSchema.methods.placeDeposit = function(userId, amount, transactionId) {
  this.deposits.push({
    user: userId,
    amount: amount || this.depositAmount,
    transactionId,
    status: 'pending'
  });
  return this.save();
};

// Method to place a bid
AuctionSchema.methods.placeBid = function(userId, amount) {
  // Check if user has placed a deposit
  const hasDeposit = this.deposits.some(deposit => 
    deposit.user.toString() === userId.toString() && 
    ['confirmed', 'applied'].includes(deposit.status)
  );
  
  if (!hasDeposit) {
    throw new Error('User must place a deposit before bidding');
  }
  
  // Check if bid amount is higher than current price
  if (amount <= this.currentPrice) {
    throw new Error('Bid amount must be higher than current price');
  }
  
  // Update previous winning bid to outbid
  this.bids.forEach(bid => {
    if (bid.status === 'winning') {
      bid.status = 'outbid';
    }
  });
  
  // Add new bid
  const newBid = {
    bidder: userId,
    amount,
    status: 'winning'
  };
  
  this.bids.push(newBid);
  this.currentPrice = amount;
  
  return this.save();
};

// Method to end auction
AuctionSchema.methods.endAuction = function() {
  if (this.status !== 'active') {
    throw new Error('Only active auctions can be ended');
  }
  
  this.status = 'ended';
  
  // Find winning bid
  const winningBid = this.bids.find(bid => bid.status === 'winning');
  
  if (winningBid) {
    this.winner = {
      user: winningBid.bidder,
      bid: winningBid._id,
      paymentStatus: 'pending',
      paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    };
    
    // Apply deposit to winner's payment
    const winnerDeposit = this.deposits.find(deposit => 
      deposit.user.toString() === winningBid.bidder.toString() &&
      deposit.status === 'confirmed'
    );
    
    if (winnerDeposit) {
      winnerDeposit.status = 'applied';
    }
  }
  
  return this.save();
};

module.exports = mongoose.model('Auction', AuctionSchema);
