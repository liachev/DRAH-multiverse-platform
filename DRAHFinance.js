const mongoose = require('mongoose');

const DRAHFinanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  ficoScore: {
    type: Number,
    required: true,
    min: 500
  },
  loanAmount: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  loanTerm: {
    type: Number,
    required: true,
    enum: [15, 20, 30]
  },
  monthlyPayment: {
    type: Number,
    required: true
  },
  applicationStatus: {
    type: String,
    enum: ['pre_qualification', 'application_submitted', 'under_review', 'approved', 'denied', 'closed'],
    default: 'pre_qualification'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: Date,
  closingDate: Date,
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadDate: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],
  income: {
    annual: Number,
    source: String,
    verification: {
      type: String,
      enum: ['not_verified', 'pending', 'verified'],
      default: 'not_verified'
    }
  },
  employment: {
    employer: String,
    position: String,
    yearsEmployed: Number,
    verification: {
      type: String,
      enum: ['not_verified', 'pending', 'verified'],
      default: 'not_verified'
    }
  },
  additionalNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the updatedAt field
DRAHFinanceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to calculate monthly payment
DRAHFinanceSchema.methods.calculateMonthlyPayment = function() {
  const principal = this.loanAmount;
  const monthlyRate = this.interestRate / 100 / 12;
  const numberOfPayments = this.loanTerm * 12;
  
  // Monthly payment formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return parseFloat(monthlyPayment.toFixed(2));
};

// Static method to check eligibility
DRAHFinanceSchema.statics.checkEligibility = function(ficoScore, income, loanAmount) {
  // Minimum requirements
  if (ficoScore < 500) {
    return {
      eligible: false,
      reason: 'FICO score below minimum requirement of 500'
    };
  }
  
  // Simple debt-to-income ratio check (should be below 43% for most mortgages)
  const monthlyIncome = income / 12;
  const estimatedMonthlyPayment = loanAmount * 0.006; // Rough estimate for initial check
  const dti = (estimatedMonthlyPayment / monthlyIncome) * 100;
  
  if (dti > 43) {
    return {
      eligible: false,
      reason: 'Debt-to-income ratio too high'
    };
  }
  
  return {
    eligible: true,
    reason: 'Meets basic eligibility requirements'
  };
};

const DRAHFinance = mongoose.model('DRAHFinance', DRAHFinanceSchema);

module.exports = DRAHFinance;
