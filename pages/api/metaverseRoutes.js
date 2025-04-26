const express = require('express');
const router = express.Router();
const MetaverseAsset = require('../../models/MetaverseAsset');

// Get all metaverse assets with filtering options
router.get('/', async (req, res) => {
  try {
    const {
      assetType,
      platform,
      minPrice,
      maxPrice,
      blockchain,
      status,
      limit = 10,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (assetType) filter.assetType = assetType;
    if (platform) filter.platform = platform;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (blockchain) filter['blockchain.network'] = blockchain;
    if (status) filter.status = status;
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query with pagination
    const metaverseAssets = await MetaverseAsset.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await MetaverseAsset.countDocuments(filter);
    
    res.json({
      metaverseAssets,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching metaverse assets:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get metaverse asset by ID
router.get('/:id', async (req, res) => {
  try {
    const metaverseAsset = await MetaverseAsset.findById(req.params.id)
      .populate('creator', 'username email profileImage')
      .populate('owner', 'username email profileImage');
    
    if (!metaverseAsset) {
      return res.status(404).json({ error: true, message: 'Metaverse asset not found' });
    }
    
    res.json(metaverseAsset);
  } catch (err) {
    console.error('Error fetching metaverse asset:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Create new metaverse asset
router.post('/', async (req, res) => {
  try {
    const newMetaverseAsset = new MetaverseAsset({
      ...req.body,
      creator: req.body.userId, // This should come from authenticated user
      owner: req.body.userId // Initially, creator is also the owner
    });
    
    const savedMetaverseAsset = await newMetaverseAsset.save();
    res.status(201).json(savedMetaverseAsset);
  } catch (err) {
    console.error('Error creating metaverse asset:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Update metaverse asset
router.put('/:id', async (req, res) => {
  try {
    const updatedMetaverseAsset = await MetaverseAsset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedMetaverseAsset) {
      return res.status(404).json({ error: true, message: 'Metaverse asset not found' });
    }
    
    res.json(updatedMetaverseAsset);
  } catch (err) {
    console.error('Error updating metaverse asset:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Delete metaverse asset
router.delete('/:id', async (req, res) => {
  try {
    const deletedMetaverseAsset = await MetaverseAsset.findByIdAndDelete(req.params.id);
    
    if (!deletedMetaverseAsset) {
      return res.status(404).json({ error: true, message: 'Metaverse asset not found' });
    }
    
    res.json({ message: 'Metaverse asset deleted successfully' });
  } catch (err) {
    console.error('Error deleting metaverse asset:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Transfer ownership of metaverse asset
router.post('/:id/transfer', async (req, res) => {
  try {
    const { newOwnerId, transactionHash } = req.body;
    
    const metaverseAsset = await MetaverseAsset.findById(req.params.id);
    
    if (!metaverseAsset) {
      return res.status(404).json({ error: true, message: 'Metaverse asset not found' });
    }
    
    // Update owner
    metaverseAsset.owner = newOwnerId;
    
    // Add transaction details if provided
    if (transactionHash) {
      metaverseAsset.blockchain.transactionHash = transactionHash;
    }
    
    await metaverseAsset.save();
    
    res.json({ message: 'Ownership transferred successfully', metaverseAsset });
  } catch (err) {
    console.error('Error transferring ownership:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get metaverse assets by platform
router.get('/platform/:platform', async (req, res) => {
  try {
    const metaverseAssets = await MetaverseAsset.find({
      platform: req.params.platform
    }).sort({ createdAt: -1 });
    
    res.json(metaverseAssets);
  } catch (err) {
    console.error('Error fetching metaverse assets by platform:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get metaverse assets by owner
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const metaverseAssets = await MetaverseAsset.find({
      owner: req.params.ownerId
    }).sort({ createdAt: -1 });
    
    res.json(metaverseAssets);
  } catch (err) {
    console.error('Error fetching metaverse assets by owner:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

module.exports = router;
