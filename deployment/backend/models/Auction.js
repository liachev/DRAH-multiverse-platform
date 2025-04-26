const mongoose = require('mongoose');

const AuctionSchema = new mongoose.Schema({
  property: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Property'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    location: {
      city: String,
      state: String
    },
    metaverseLocation: {
      platform: String,
      district: String
    },
    propertyType: {
      type: String,
      required: true
    },
    environment: {
      type: String,
      required: true
    },
    images: [{
      url: String,
      caption: String
    }],
    isDRAH: {
      type: Boolean,
      default: false
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startingBid: {
    type: Number,
    required: true,
    min: 0
  },
  currentBid: {
    type: Number,
    required: true,
    min: 0
  },
  depositAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'active', 'ended', 'cancelled'],
    default: 'pending'
  },
  bids: [{
    bidder: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
      firstName: String,
      lastName: String
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isWinning: {
      type: Boolean,
      default: false
    }
  }],
  deposits: [{
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
      firstName: String,
      lastName: String
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'refunded', 'applied'],
      default: 'pending'
    }
  }],
  isDRAH: {
    type: Boolean,
    default: false
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

// Update the updatedAt field on save
AuctionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Auction', AuctionSchema);
