const mongoose = require('mongoose');

const FinanceApplicationSchema = new mongoose.Schema({
  applicant: {
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
    },
    ficoScore: {
      type: Number,
      required: true,
      min: 300,
      max: 850
    }
  },
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
    price: {
      type: Number,
      required: true
    }
  },
  loanAmount: {
    type: Number,
    required: true,
    min: 0
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0
  },
  loanTerm: {
    type: Number,
    required: true,
    min: 1
  },
  monthlyPayment: {
    type: Number,
    required: true,
    min: 0
  },
  downPayment: {
    type: Number,
    default: 0,
    min: 0
  },
  pmi: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'denied', 'completed'],
    default: 'pending'
  },
  isDRAH: {
    type: Boolean,
    default: false
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  decisionDate: {
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
FinanceApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FinanceApplication', FinanceApplicationSchema);
