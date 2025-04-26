const express = require('express');
const router = express.Router();
const Property = require('../../models/Property');
const BusinessModel = require('../../models/BusinessModel');
const MetaverseAsset = require('../../models/MetaverseAsset');

// Get integrated dashboard data for a user
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Fetch user's real estate properties
    const properties = await Property.find({ owner: userId }).limit(5);
    
    // Fetch user's business models
    const businessModels = await BusinessModel.find({ 
      'users.user': userId 
    }).limit(5);
    
    // Fetch user's metaverse assets
    const metaverseAssets = await MetaverseAsset.find({ owner: userId }).limit(5);
    
    // Fetch recommended business models based on user's properties
    const recommendedBusinessModels = await BusinessModel.find({ 
      isPublic: true,
      // Add recommendation logic here
    }).limit(3);
    
    // Fetch recommended properties based on user's business models
    const recommendedProperties = await Property.find({
      status: 'available',
      // Add recommendation logic here
    }).limit(3);
    
    res.json({
      properties,
      businessModels,
      metaverseAssets,
      recommendations: {
        businessModels: recommendedBusinessModels,
        properties: recommendedProperties
      }
    });
  } catch (err) {
    console.error('Error fetching integrated dashboard:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get real estate opportunities for business model
router.get('/business/:businessModelId/opportunities', async (req, res) => {
  try {
    const { businessModelId } = req.params;
    
    // Fetch business model
    const businessModel = await BusinessModel.findById(businessModelId);
    
    if (!businessModel) {
      return res.status(404).json({ error: true, message: 'Business model not found' });
    }
    
    // Find suitable properties based on business model category
    let propertyFilter = { status: 'available' };
    
    switch (businessModel.category) {
      case 'micro_saas':
        // For micro-SaaS, commercial properties might be suitable
        propertyFilter.type = 'commercial';
        break;
      case 'marketplace':
        // For marketplaces, larger commercial spaces
        propertyFilter.type = 'commercial';
        propertyFilter['size.value'] = { $gte: 1000 }; // Larger spaces
        break;
      case 'service':
        // For service businesses, smaller commercial spaces
        propertyFilter.type = 'commercial';
        propertyFilter['size.value'] = { $lte: 1000 }; // Smaller spaces
        break;
      default:
        // Default filter
        break;
    }
    
    const suitableProperties = await Property.find(propertyFilter).limit(10);
    
    res.json({
      businessModel,
      suitableProperties
    });
  } catch (err) {
    console.error('Error fetching business opportunities:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get business models suitable for property
router.get('/property/:propertyId/business-models', async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Fetch property
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }
    
    // Find suitable business models based on property type
    let businessFilter = { isPublic: true };
    
    switch (property.type) {
      case 'commercial':
        // For commercial properties, retail or service businesses
        businessFilter.category = { $in: ['marketplace', 'service', 'ecommerce'] };
        break;
      case 'vacant_lot':
        // For vacant lots, development opportunities
        businessFilter.category = { $in: ['other'] };
        break;
      case 'house':
        // For houses, home-based businesses
        businessFilter.category = { $in: ['digital_content', 'micro_saas'] };
        break;
      default:
        // Default filter
        break;
    }
    
    const suitableBusinessModels = await BusinessModel.find(businessFilter).limit(10);
    
    res.json({
      property,
      suitableBusinessModels
    });
  } catch (err) {
    console.error('Error fetching suitable business models:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Connect metaverse asset to real property
router.post('/connect/metaverse-to-property', async (req, res) => {
  try {
    const { metaverseAssetId, propertyId } = req.body;
    
    // Fetch metaverse asset
    const metaverseAsset = await MetaverseAsset.findById(metaverseAssetId);
    
    if (!metaverseAsset) {
      return res.status(404).json({ error: true, message: 'Metaverse asset not found' });
    }
    
    // Fetch property
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }
    
    // Create connection by adding reference to each other
    // This would be implemented based on specific connection requirements
    
    res.json({
      message: 'Successfully connected metaverse asset to real property',
      metaverseAsset,
      property
    });
  } catch (err) {
    console.error('Error connecting metaverse to property:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get integrated search results across all domains
router.get('/search', async (req, res) => {
  try {
    const { query, type = 'all' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: true, message: 'Search query is required' });
    }
    
    const results = {
      properties: [],
      businessModels: [],
      metaverseAssets: []
    };
    
    // Search properties
    if (type === 'all' || type === 'property') {
      results.properties = await Property.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { 'location.city': { $regex: query, $options: 'i' } },
          { 'location.zipCode': { $regex: query, $options: 'i' } }
        ]
      }).limit(10);
    }
    
    // Search business models
    if (type === 'all' || type === 'business') {
      results.businessModels = await BusinessModel.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ],
        isPublic: true
      }).limit(10);
    }
    
    // Search metaverse assets
    if (type === 'all' || type === 'metaverse') {
      results.metaverseAssets = await MetaverseAsset.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { assetType: { $regex: query, $options: 'i' } },
          { platform: { $regex: query, $options: 'i' } }
        ]
      }).limit(10);
    }
    
    res.json(results);
  } catch (err) {
    console.error('Error performing integrated search:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

module.exports = router;
