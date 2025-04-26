const mongoose = require('mongoose');

const BusinessModelSchema = new mongoose.Schema({
  creator: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  businessType: {
    type: String,
    required: true,
    enum: ['retail', 'saas', 'manufacturing', 'service', 'nonprofit', 'other']
  },
  businessName: {
    type: String,
    trim: true
  },
  initialCapital: {
    type: Number,
    required: true,
    min: 0
  },
  targetMarket: {
    type: String,
    required: true
  },
  humanitarianFocus: {
    type: Boolean,
    default: false
  },
  scalability: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  buffettPrinciples: [{
    principle: {
      type: String,
      required: true
    },
    application: {
      type: String,
      required: true
    }
  }],
  businessModelTemplate: {
    revenueStreams: [String],
    costStructure: [String],
    keyMetrics: [String],
    scalabilityFactors: [String]
  },
  capitalStrategy: {
    type: String
  },
  humanitarianStrategy: [String],
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
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
BusinessModelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BusinessModel', BusinessModelSchema);
