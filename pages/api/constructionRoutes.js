const express = require('express');
const router = express.Router();
const ConstructionService = require('../models/ConstructionService');

// GET all construction service requests
router.get('/', async (req, res) => {
  try {
    const services = await ConstructionService.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET construction service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await ConstructionService.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Construction service request not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new construction service request
router.post('/', async (req, res) => {
  try {
    const service = new ConstructionService(req.body);
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update construction service request
router.put('/:id', async (req, res) => {
  try {
    const updatedService = await ConstructionService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedService) {
      return res.status(404).json({ message: 'Construction service request not found' });
    }
    
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE construction service request
router.delete('/:id', async (req, res) => {
  try {
    const deletedService = await ConstructionService.findByIdAndDelete(req.params.id);
    
    if (!deletedService) {
      return res.status(404).json({ message: 'Construction service request not found' });
    }
    
    res.json({ message: 'Construction service request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST calculate construction cost
router.post('/calculate', async (req, res) => {
  try {
    const { 
      squareFootage, 
      constructionType, 
      location, 
      features,
      isDRAH
    } = req.body;
    
    if (!squareFootage || !constructionType) {
      return res.status(400).json({ message: 'Square footage and construction type are required' });
    }
    
    // Base cost per square foot based on construction type
    let baseCostPerSqFt;
    switch (constructionType) {
      case 'basic':
        baseCostPerSqFt = 150;
        break;
      case 'standard':
        baseCostPerSqFt = 200;
        break;
      case 'premium':
        baseCostPerSqFt = 300;
        break;
      case 'luxury':
        baseCostPerSqFt = 400;
        break;
      default:
        baseCostPerSqFt = 200;
    }
    
    // Location adjustment factor
    let locationFactor = 1.0;
    if (location) {
      // Example location factors (could be expanded with more locations)
      switch (location.state) {
        case 'CA':
          locationFactor = 1.3;
          break;
        case 'NY':
          locationFactor = 1.25;
          break;
        case 'TX':
          locationFactor = 0.9;
          break;
        case 'FL':
          locationFactor = 0.95;
          break;
        default:
          locationFactor = 1.0;
      }
    }
    
    // Feature adjustments
    let featuresCost = 0;
    if (features && Array.isArray(features)) {
      features.forEach(feature => {
        switch (feature) {
          case 'solar_panels':
            featuresCost += squareFootage * 10;
            break;
          case 'smart_home':
            featuresCost += squareFootage * 5;
            break;
          case 'hurricane_resistant':
            featuresCost += squareFootage * 15;
            break;
          case 'flood_resistant':
            featuresCost += squareFootage * 12;
            break;
          case 'energy_efficient':
            featuresCost += squareFootage * 8;
            break;
          case 'ev_charging':
            featuresCost += 2500;
            break;
          // Add more features as needed
        }
      });
    }
    
    // Calculate base cost
    const baseCost = squareFootage * baseCostPerSqFt * locationFactor;
    
    // Add features cost
    const totalCost = baseCost + featuresCost;
    
    // Apply DRAH discount (10% savings)
    const drahDiscount = isDRAH ? totalCost * 0.1 : 0;
    const finalCost = totalCost - drahDiscount;
    
    res.json({
      baseCost: baseCost.toFixed(2),
      featuresCost: featuresCost.toFixed(2),
      totalCost: totalCost.toFixed(2),
      drahDiscount: drahDiscount.toFixed(2),
      finalCost: finalCost.toFixed(2),
      costPerSquareFoot: (finalCost / squareFootage).toFixed(2),
      details: {
        squareFootage,
        constructionType,
        baseCostPerSqFt,
        locationFactor,
        features,
        isDRAH
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user service requests
router.get('/user/:userId', async (req, res) => {
  try {
    const services = await ConstructionService.find({ 'client._id': req.params.userId });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
