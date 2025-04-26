const express = require('express');
const router = express.Router();
const PropertyScraperService = require('../../services/PropertyScraperService');
const Property = require('../../models/Property');

// Scrape vacant lots by location (zip code or city name)
router.get('/scrape/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { limit = 10, saveToDb = true } = req.query;
    
    console.log(`Starting scrape for location: ${location}, limit: ${limit}`);
    
    // Scrape properties from external sources
    const scrapedProperties = await PropertyScraperService.scrapeVacantLots(location, Number(limit));
    
    console.log(`Successfully scraped ${scrapedProperties.length} properties`);
    
    // Get city resources for the location
    const cityResources = await PropertyScraperService.getCityResources(
      /^\d{5}$/.test(location) ? location : '70032' // Default to St. Bernard Parish if not a zip code
    );
    
    // Add resources to each property
    for (const property of scrapedProperties) {
      property.resources = Object.keys(cityResources).map(key => ({
        type: cityResources[key].type,
        name: cityResources[key].name,
        url: cityResources[key].url,
        description: cityResources[key].description
      }));
    }
    
    let savedProperties = [];
    
    // Save to database if requested
    if (saveToDb === 'true') {
      savedProperties = await PropertyScraperService.saveProperties(scrapedProperties);
      console.log(`Saved ${savedProperties.length} properties to database`);
    }
    
    res.json({
      message: `Successfully scraped ${scrapedProperties.length} properties for location: ${location}`,
      properties: saveToDb === 'true' ? savedProperties : scrapedProperties
    });
  } catch (err) {
    console.error('Error in scraper route:', err);
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

// Get DRAH properties by zip code
router.get('/drah/:zipCode', async (req, res) => {
  try {
    const { zipCode } = req.params;
    
    const properties = await Property.find({
      isForDRAH: true,
      'location.zipCode': zipCode
    });
    
    res.json(properties);
  } catch (err) {
    console.error('Error getting DRAH properties:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get DRAH properties by city
router.get('/drah/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    const properties = await Property.find({
      isForDRAH: true,
      'location.city': { $regex: city, $options: 'i' }
    });
    
    res.json(properties);
  } catch (err) {
    console.error('Error getting DRAH properties by city:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Run scheduled scraping for multiple locations
router.post('/scheduled-scrape', async (req, res) => {
  try {
    const { locations, limit = 5 } = req.body;
    
    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({ error: true, message: 'Locations array is required' });
    }
    
    const results = {};
    
    // Process each location
    for (const location of locations) {
      try {
        // Scrape properties
        const scrapedProperties = await PropertyScraperService.scrapeVacantLots(location, Number(limit));
        
        // Get city resources
        const cityResources = await PropertyScraperService.getCityResources(
          /^\d{5}$/.test(location) ? location : '70032'
        );
        
        // Add resources to each property
        for (const property of scrapedProperties) {
          property.resources = Object.keys(cityResources).map(key => ({
            type: cityResources[key].type,
            name: cityResources[key].name,
            url: cityResources[key].url,
            description: cityResources[key].description
          }));
        }
        
        // Save to database
        const savedProperties = await PropertyScraperService.saveProperties(scrapedProperties);
        
        results[location] = {
          scraped: scrapedProperties.length,
          saved: savedProperties.length
        };
      } catch (locationError) {
        console.error(`Error processing location ${location}:`, locationError);
        results[location] = { error: locationError.message };
      }
    }
    
    res.json({
      message: 'Scheduled scraping completed',
      results
    });
  } catch (err) {
    console.error('Error in scheduled scraping:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

module.exports = router;
