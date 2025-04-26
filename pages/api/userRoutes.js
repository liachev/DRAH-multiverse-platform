const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: true, 
        message: 'User with this email or username already exists' 
      });
    }
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password, // Will be hashed by pre-save hook
      firstName,
      lastName
    });
    
    const savedUser = await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      user: userResponse,
      token
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({
      user: userResponse,
      token
    });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('properties')
      .populate('auctions')
      .populate('businessModels')
      .populate('metaverseAssets');
    
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Update user profile
router.put('/profile/:id', async (req, res) => {
  try {
    // Remove sensitive fields that shouldn't be updated directly
    const { password, role, ...updateData } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Update user password
router.put('/password/:id', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ error: true, message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Add wallet address to user
router.post('/wallet/:id', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { walletAddress },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (err) {
    console.error('Error adding wallet address:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Get user's properties
router.get('/:id/properties', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('properties');
    
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    res.json(user.properties);
  } catch (err) {
    console.error('Error fetching user properties:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get user's auctions
router.get('/:id/auctions', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('auctions');
    
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    res.json(user.auctions);
  } catch (err) {
    console.error('Error fetching user auctions:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get user's business models
router.get('/:id/business-models', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('businessModels');
    
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    res.json(user.businessModels);
  } catch (err) {
    console.error('Error fetching user business models:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get user's metaverse assets
router.get('/:id/metaverse-assets', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('metaverseAssets');
    
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    res.json(user.metaverseAssets);
  } catch (err) {
    console.error('Error fetching user metaverse assets:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

module.exports = router;
