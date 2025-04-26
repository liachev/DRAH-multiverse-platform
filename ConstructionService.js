const mongoose = require('mongoose');

const ConstructionServiceSchema = new mongoose.Schema({
  client: {
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
  property: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    },
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['new_construction', 'renovation', 'addition', 'repair', 'disaster_resistant_upgrade']
  },
  squareFootage: {
    type: Number,
    required: true,
    min: 0
  },
  constructionType: {
    type: String,
    required: true,
    enum: ['basic', 'standard', 'premium', 'luxury']
  },
  features: [{
    type: String,
    enum: [
      'solar_panels', 
      'smart_home', 
      'hurricane_resistant', 
      'flood_resistant', 
      'energy_efficient', 
      'ev_charging'
    ]
  }],
  estimatedCost: {
    type: Number,
    required: true,
    min: 0
  },
  drahDiscount: {
    type: Number,
    default: 0,
    min: 0
  },
  finalCost: {
    type: Number,
    required: true,
    min: 0
  },
  isDRAH: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  startDate: {
    type: Date
  },
  estimatedCompletionDate: {
    type: Date
  },
  actualCompletionDate: {
    type: Date
  },
  notes: {
    type: String
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
ConstructionServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ConstructionService', ConstructionServiceSchema);
