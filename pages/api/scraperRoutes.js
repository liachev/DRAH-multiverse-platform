const express = require('express');
const router = express.Router();
const PropertyScraperService = require('../../services/PropertyScraperService');
const Property = require('../../models/Property');

// Scrape vacant lots by location (zip code or city name)
router.get('/scrape/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { limit = 10 } = req.query;
    
    // Scrape properties from external sources
    const scrapedProperties = await PropertyScraperService.scrapeVacantLots(location, Number(limit));
    
    // Get city resources for the location
    const cityResources = await PropertyScraperService.getCityResources(location);
    
    // Process and save properties to database
    const savedProperties = [];
    
    for (const property of scrapedProperties) {
      // Add resources to property
      property.resources = Object.keys(cityResources).map(key => ({
        type: key,
        name: cityResources[key].name,
        url: cityResources[key].url,
        description: cityResources[key].description
      }));
      
      // Mark as DRAH property
      property.isForDRAH = true;
      
      // Save to database
      const newProperty = new Property(property);
      const savedProperty = await newProperty.save();
      savedProperties.push(savedProperty);
    }
    
    res.json({
      message: `Successfully scraped ${savedProperties.length} properties for location: ${location}`,
      properties: savedProperties
    });
  } catch (err) {
    console.error('Error scraping properties:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get city resources by zip code
router.get('/resources/:zipCode', async (req, res) => {
  try {
    const { zipCode } = req.params;
    
    const resources = await PropertyScraperService.getCityResources(zipCode);
    
    res.json(resources);
  } catch (err) {
    console.error('Error getting city resources:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

module.exports = router;
