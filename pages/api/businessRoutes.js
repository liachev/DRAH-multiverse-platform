const express = require('express');
const router = express.Router();
const BusinessModel = require('../../models/BusinessModel');

// Get all business models with filtering options
router.get('/', async (req, res) => {
  try {
    const {
      category,
      minInvestment,
      maxInvestment,
      revenueModel,
      limit = 10,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (minInvestment || maxInvestment) {
      filter['initialInvestment.min'] = {};
      if (minInvestment) filter['initialInvestment.min'].$gte = Number(minInvestment);
      if (maxInvestment) filter['initialInvestment.max'].$lte = Number(maxInvestment);
    }
    if (revenueModel) filter.revenueModel = revenueModel;
    
    // Only show public models unless specifically requested
    if (!req.query.showPrivate || req.query.showPrivate !== 'true') {
      filter.isPublic = true;
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query with pagination
    const businessModels = await BusinessModel.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await BusinessModel.countDocuments(filter);
    
    res.json({
      businessModels,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching business models:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get business model by ID
router.get('/:id', async (req, res) => {
  try {
    const businessModel = await BusinessModel.findById(req.params.id)
      .populate('createdBy', 'username email profileImage')
      .populate('users.user', 'username email profileImage');
    
    if (!businessModel) {
      return res.status(404).json({ error: true, message: 'Business model not found' });
    }
    
    res.json(businessModel);
  } catch (err) {
    console.error('Error fetching business model:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Create new business model
router.post('/', async (req, res) => {
  try {
    const newBusinessModel = new BusinessModel({
      ...req.body,
      createdBy: req.body.userId // This should come from authenticated user
    });
    
    const savedBusinessModel = await newBusinessModel.save();
    res.status(201).json(savedBusinessModel);
  } catch (err) {
    console.error('Error creating business model:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Update business model
router.put('/:id', async (req, res) => {
  try {
    const updatedBusinessModel = await BusinessModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedBusinessModel) {
      return res.status(404).json({ error: true, message: 'Business model not found' });
    }
    
    res.json(updatedBusinessModel);
  } catch (err) {
    console.error('Error updating business model:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Delete business model
router.delete('/:id', async (req, res) => {
  try {
    const deletedBusinessModel = await BusinessModel.findByIdAndDelete(req.params.id);
    
    if (!deletedBusinessModel) {
      return res.status(404).json({ error: true, message: 'Business model not found' });
    }
    
    res.json({ message: 'Business model deleted successfully' });
  } catch (err) {
    console.error('Error deleting business model:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Add user to business model
router.post('/:id/users', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const businessModel = await BusinessModel.findById(req.params.id);
    
    if (!businessModel) {
      return res.status(404).json({ error: true, message: 'Business model not found' });
    }
    
    // Check if user already added
    const existingUser = businessModel.users.find(
      user => user.user.toString() === userId
    );
    
    if (existingUser) {
      return res.status(400).json({ error: true, message: 'User already added to this business model' });
    }
    
    // Add user
    businessModel.users.push({
      user: userId,
      progress: 0,
      startDate: new Date()
    });
    
    await businessModel.save();
    
    res.json({ message: 'User added to business model successfully', businessModel });
  } catch (err) {
    console.error('Error adding user to business model:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Update user progress in business model
router.put('/:id/users/:userId/progress', async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ error: true, message: 'Progress must be between 0 and 100' });
    }
    
    const businessModel = await BusinessModel.findById(req.params.id);
    
    if (!businessModel) {
      return res.status(404).json({ error: true, message: 'Business model not found' });
    }
    
    // Find user in business model
    const userIndex = businessModel.users.findIndex(
      user => user.user.toString() === req.params.userId
    );
    
    if (userIndex === -1) {
      return res.status(404).json({ error: true, message: 'User not found in this business model' });
    }
    
    // Update progress
    businessModel.users[userIndex].progress = progress;
    
    await businessModel.save();
    
    res.json({ message: 'User progress updated successfully', businessModel });
  } catch (err) {
    console.error('Error updating user progress:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get business models by category
router.get('/category/:category', async (req, res) => {
  try {
    const businessModels = await BusinessModel.find({
      category: req.params.category,
      isPublic: true
    }).sort({ createdAt: -1 });
    
    res.json(businessModels);
  } catch (err) {
    console.error('Error fetching business models by category:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get business models by investment range
router.get('/investment/:min/:max', async (req, res) => {
  try {
    const { min, max } = req.params;
    
    const businessModels = await BusinessModel.find({
      'initialInvestment.min': { $gte: Number(min) },
      'initialInvestment.max': { $lte: Number(max) },
      isPublic: true
    }).sort({ 'initialInvestment.min': 1 });
    
    res.json(businessModels);
  } catch (err) {
    console.error('Error fetching business models by investment range:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

module.exports = router;
