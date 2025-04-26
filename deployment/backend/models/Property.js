const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    }
  },
  metaverseLocation: {
    platform: {
      type: String,
      trim: true
    },
    district: {
      type: String,
      trim: true
    },
    coordinates: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true
    }
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['house', 'apartment', 'condo', 'land', 'metaverse_land', 'commercial']
  },
  environment: {
    type: String,
    required: true,
    enum: ['real_world', 'metaverse']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String
    }
  }],
  bedrooms: {
    type: Number,
    min: 0
  },
  bathrooms: {
    type: Number,
    min: 0
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  sizeUnit: {
    type: String,
    required: true,
    enum: ['sqft', 'sqm', 'acres', 'hectares', 'parcels']
  },
  isDRAH: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'pending', 'sold', 'rented', 'off_market'],
    default: 'available'
  },
  features: [{
    type: String
  }],
  drahDetails: {
    disasterType: {
      type: String,
      enum: ['hurricane', 'flood', 'tornado', 'earthquake', 'wildfire']
    },
    affordableHousingEligible: {
      type: Boolean,
      default: false
    },
    constructionReady: {
      type: Boolean,
      default: false
    }
  },
  metaverseDetails: {
    trafficScore: {
      type: Number,
      min: 0,
      max: 100
    },
    developmentLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High']
    },
    neighboringBrands: [{
      type: String
    }]
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
PropertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Property', PropertySchema);
