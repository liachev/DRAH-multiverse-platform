const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// GET all properties
router.get('/', async (req, res) => {
  try {
    const { propertyType, environment, minPrice, maxPrice, isDRAH, location } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (propertyType) {
      filter.propertyType = propertyType;
    }
    
    if (environment) {
      filter.environment = environment;
    }
    
    if (minPrice) {
      filter.price = { ...filter.price, $gte: parseInt(minPrice) };
    }
    
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: parseInt(maxPrice) };
    }
    
    if (isDRAH === 'true') {
      filter.isDRAH = true;
    }
    
    if (location) {
      filter.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.zipCode': { $regex: location, $options: 'i' } },
        { 'metaverseLocation.platform': { $regex: location, $options: 'i' } },
        { 'metaverseLocation.district': { $regex: location, $options: 'i' } }
      ];
    }
    
    const properties = await Property.find(filter);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new property
router.post('/', async (req, res) => {
  try {
    const property = new Property(req.body);
    const savedProperty = await property.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update property
router.put('/:id', async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE property
router.delete('/:id', async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    
    if (!deletedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET DRAH eligible properties
router.get('/filter/drah', async (req, res) => {
  try {
    const properties = await Property.find({ isDRAH: true });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET metaverse properties
router.get('/filter/metaverse', async (req, res) => {
  try {
    const properties = await Property.find({ environment: 'metaverse' });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET real world properties
router.get('/filter/real-world', async (req, res) => {
  try {
    const properties = await Property.find({ environment: 'real_world' });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
