const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: 'default-profile.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'developer'],
    default: 'user'
  },
  walletAddress: {
    type: String,
    trim: true
  },
  properties: [{
    type: Schema.Types.ObjectId,
    ref: 'Property'
  }],
  auctions: [{
    type: Schema.Types.ObjectId,
    ref: 'Auction'
  }],
  bids: [{
    type: Schema.Types.ObjectId,
    ref: 'Auction'
  }],
  deposits: [{
    auction: {
      type: Schema.Types.ObjectId,
      ref: 'Auction'
    },
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'refunded', 'applied'],
      default: 'pending'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  businessModels: [{
    type: Schema.Types.ObjectId,
    ref: 'BusinessModel'
  }],
  metaverseAssets: [{
    type: Schema.Types.ObjectId,
    ref: 'MetaverseAsset'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
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
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ walletAddress: 1 });

// Update the updatedAt field on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Only hash password if it's modified or new
  if (!this.isModified('password')) return next();
  
  // Hash password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      
      this.password = hash;
      next();
    });
  });
});

// Method to compare passwords
UserSchema.methods.comparePassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

module.exports = mongoose.model('User', UserSchema);
