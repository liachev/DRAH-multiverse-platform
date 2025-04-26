const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusinessModelSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['micro_saas', 'digital_content', 'marketplace', 'service', 'ecommerce', 'other'],
    required: true
  },
  initialInvestment: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP'],
      default: 'USD'
    }
  },
  revenueModel: {
    type: String,
    enum: ['subscription', 'one_time', 'commission', 'advertising', 'freemium', 'other'],
    required: true
  },
  features: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  aiComponents: [{
    type: {
      type: String,
      enum: ['datafication', 'algorithm', 'automation', 'innovation'],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  steps: [{
    order: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    estimatedTimeInDays: {
      type: Number
    }
  }],
  resources: [{
    type: {
      type: String,
      enum: ['template', 'guide', 'tool', 'service', 'other'],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  successStories: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    testimonial: {
      type: String
    },
    results: {
      type: String
    },
    imageUrl: {
      type: String,
      trim: true
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  users: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    startDate: {
      type: Date,
      default: Date.now
    }
  }],
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
BusinessModelSchema.index({ category: 1 });
BusinessModelSchema.index({ 'initialInvestment.min': 1 });
BusinessModelSchema.index({ revenueModel: 1 });
BusinessModelSchema.index({ isPublic: 1 });

// Update the updatedAt field on save
BusinessModelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BusinessModel', BusinessModelSchema);
