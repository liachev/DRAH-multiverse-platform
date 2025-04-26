const express = require('express');
const router = express.Router();
const Property = require('../../models/Property');

// Get all properties with filtering options
router.get('/', async (req, res) => {
  try {
    const {
      type,
      minPrice,
      maxPrice,
      zipCode,
      city,
      status,
      isForDRAH,
      limit = 10,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (zipCode) filter['location.zipCode'] = zipCode;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (status) filter.status = status;
    if (isForDRAH) filter.isForDRAH = isForDRAH === 'true';

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query with pagination
    const properties = await Property.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await Property.countDocuments(filter);
    
    res.json({
      properties,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }
    
    res.json(property);
  } catch (err) {
    console.error('Error fetching property:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Create new property
router.post('/', async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Update property
router.put('/:id', async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedProperty) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }
    
    res.json(updatedProperty);
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(400).json({ error: true, message: err.message });
  }
});

// Delete property
router.delete('/:id', async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    
    if (!deletedProperty) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }
    
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Search properties by location (zip code or city)
router.get('/search/location', async (req, res) => {
  try {
    const { query, type = 'all' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: true, message: 'Search query is required' });
    }
    
    const filter = {
      $or: [
        { 'location.zipCode': { $regex: query, $options: 'i' } },
        { 'location.city': { $regex: query, $options: 'i' } }
      ]
    };
    
    if (type !== 'all') {
      filter.type = type;
    }
    
    const properties = await Property.find(filter).limit(20);
    
    res.json(properties);
  } catch (err) {
    console.error('Error searching properties:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get DRAH properties
router.get('/drah/listings', async (req, res) => {
  try {
    const drahProperties = await Property.find({ isForDRAH: true })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(drahProperties);
  } catch (err) {
    console.error('Error fetching DRAH properties:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

module.exports = router;
