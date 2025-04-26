const express = require('express');
const router = express.Router();
const Property = require('../../models/Property');
const Auction = require('../../models/Auction');

// Search properties by location (zip code or city name)
router.get('/properties', async (req, res) => {
  try {
    const { 
      query, 
      type = 'all', 
      radius = 10, // in miles
      minPrice,
      maxPrice,
      status = 'all',
      isForDRAH,
      limit = 10,
      page = 1
    } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: true, message: 'Search query is required' });
    }
    
    // Build filter object
    const filter = {};
    
    // Location search (zip code or city)
    filter.$or = [
      { 'location.zipCode': { $regex: query, $options: 'i' } },
      { 'location.city': { $regex: query, $options: 'i' } },
      { 'location.state': { $regex: query, $options: 'i' } },
      { 'location.address': { $regex: query, $options: 'i' } }
    ];
    
    // Property type filter
    if (type !== 'all') {
      filter.type = type;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Status filter
    if (status !== 'all') {
      filter.status = status;
    }
    
    // DRAH filter
    if (isForDRAH === 'true') {
      filter.isForDRAH = true;
    }
    
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
    console.error('Error searching properties by location:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Search auctions by location (zip code or city name)
router.get('/auctions', async (req, res) => {
  try {
    const { 
      query, 
      propertyType = 'all', 
      minPrice,
      maxPrice,
      isForDRAH,
      limit = 10,
      page = 1
    } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: true, message: 'Search query is required' });
    }
    
    // Find properties matching the location query
    const propertyFilter = {
      $or: [
        { 'location.zipCode': { $regex: query, $options: 'i' } },
        { 'location.city': { $regex: query, $options: 'i' } },
        { 'location.state': { $regex: query, $options: 'i' } }
      ],
      status: 'auction'
    };
    
    // Property type filter
    if (propertyType !== 'all') {
      propertyFilter.type = propertyType;
    }
    
    // DRAH filter
    if (isForDRAH === 'true') {
      propertyFilter.isForDRAH = true;
    }
    
    // Find properties matching the criteria
    const properties = await Property.find(propertyFilter).select('_id');
    const propertyIds = properties.map(p => p._id);
    
    // Find auctions for these properties
    const auctionFilter = {
      property: { $in: propertyIds },
      status: 'active'
    };
    
    // Price range filter for auctions
    if (minPrice || maxPrice) {
      auctionFilter.currentPrice = {};
      if (minPrice) auctionFilter.currentPrice.$gte = Number(minPrice);
      if (maxPrice) auctionFilter.currentPrice.$lte = Number(maxPrice);
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query with pagination
    const auctions = await Auction.find(auctionFilter)
      .populate('property')
      .skip(skip)
      .limit(Number(limit))
      .sort({ endDate: 1 });
    
    // Get total count for pagination
    const total = await Auction.countDocuments(auctionFilter);
    
    res.json({
      auctions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Error searching auctions by location:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get properties by coordinates and radius
router.get('/properties/coordinates', async (req, res) => {
  try {
    const { 
      lat, 
      lng, 
      radius = 10, // in miles
      type = 'all',
      status = 'all',
      isForDRAH,
      limit = 10,
      page = 1
    } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: true, message: 'Latitude and longitude are required' });
    }
    
    // Convert radius from miles to meters (1 mile = 1609.34 meters)
    const radiusInMeters = Number(radius) * 1609.34;
    
    // Build filter object
    const filter = {
      'location.coordinates': {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: radiusInMeters
        }
      }
    };
    
    // Property type filter
    if (type !== 'all') {
      filter.type = type;
    }
    
    // Status filter
    if (status !== 'all') {
      filter.status = status;
    }
    
    // DRAH filter
    if (isForDRAH === 'true') {
      filter.isForDRAH = true;
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query with pagination
    const properties = await Property.find(filter)
      .skip(skip)
      .limit(Number(limit));
    
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
    console.error('Error searching properties by coordinates:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get zip code information
router.get('/zipcode/:zipCode', async (req, res) => {
  try {
    const { zipCode } = req.params;
    
    // Validate zip code format
    if (!/^\d{5}$/.test(zipCode)) {
      return res.status(400).json({ error: true, message: 'Invalid zip code format' });
    }
    
    // In a real implementation, this would call an external API or database
    // For demonstration, we'll use mock data for the specified zip codes
    const zipCodeData = {
      '70032': {
        city: 'St. Bernard Parish',
        state: 'LA',
        county: 'St. Bernard',
        coordinates: {
          lat: 29.9511,
          lng: -90.0715
        },
        population: 35897,
        medianHomeValue: 125000,
        medianIncome: 41000
      },
      '70043': {
        city: 'Chalmette',
        state: 'LA',
        county: 'St. Bernard',
        coordinates: {
          lat: 29.9427,
          lng: -89.9629
        },
        population: 16751,
        medianHomeValue: 130000,
        medianIncome: 42000
      },
      '70075': {
        city: 'Meraux',
        state: 'LA',
        county: 'St. Bernard',
        coordinates: {
          lat: 29.9269,
          lng: -89.9301
        },
        population: 7000,
        medianHomeValue: 135000,
        medianIncome: 45000
      },
      '70092': {
        city: 'Violet',
        state: 'LA',
        county: 'St. Bernard',
        coordinates: {
          lat: 29.9033,
          lng: -89.8931
        },
        population: 8000,
        medianHomeValue: 120000,
        medianIncome: 40000
      }
    };
    
    // Get data for the requested zip code
    const data = zipCodeData[zipCode];
    
    if (!data) {
      return res.status(404).json({ error: true, message: 'Zip code information not found' });
    }
    
    // Get property counts for this zip code
    const propertyCounts = await Property.aggregate([
      { $match: { 'location.zipCode': zipCode } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Format property counts
    const propertyStats = {
      total: 0,
      available: 0,
      auction: 0,
      pending: 0,
      sold: 0
    };
    
    propertyCounts.forEach(item => {
      propertyStats[item._id] = item.count;
      propertyStats.total += item.count;
    });
    
    // Get DRAH property count
    const drahCount = await Property.countDocuments({
      'location.zipCode': zipCode,
      isForDRAH: true
    });
    
    res.json({
      zipCode,
      ...data,
      propertyStats,
      drahCount
    });
  } catch (err) {
    console.error('Error getting zip code information:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get city information
router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { state } = req.query;
    
    // In a real implementation, this would call an external API or database
    // For demonstration, we'll use mock data for the specified cities
    const cityData = {
      'St. Bernard Parish': {
        state: 'LA',
        county: 'St. Bernard',
        coordinates: {
          lat: 29.9511,
          lng: -90.0715
        },
        population: 35897,
        medianHomeValue: 125000,
        medianIncome: 41000,
        zipCodes: ['70032', '70043', '70075', '70092']
      },
      'Chalmette': {
        state: 'LA',
        county: 'St. Bernard',
        coordinates: {
          lat: 29.9427,
          lng: -89.9629
        },
        population: 16751,
        medianHomeValue: 130000,
        medianIncome: 42000,
        zipCodes: ['70043']
      },
      'Meraux': {
        state: 'LA',
        county: 'St. Bernard',
        coordinates: {
          lat: 29.9269,
          lng: -89.9301
        },
        population: 7000,
        medianHomeValue: 135000,
        medianIncome: 45000,
        zipCodes: ['70075']
      },
      'Violet': {
        state: 'LA',
        county: 'St. Bernard',
        coordinates: {
          lat: 29.9033,
          lng: -89.8931
        },
        population: 8000,
        medianHomeValue: 120000,
        medianIncome: 40000,
        zipCodes: ['70092']
      }
    };
    
    // Normalize city name for case-insensitive lookup
    const normalizedCity = Object.keys(cityData).find(
      c => c.toLowerCase() === city.toLowerCase()
    );
    
    if (!normalizedCity) {
      return res.status(404).json({ error: true, message: 'City information not found' });
    }
    
    const data = cityData[normalizedCity];
    
    // If state is provided, verify it matches
    if (state && data.state.toLowerCase() !== state.toLowerCase()) {
      return res.status(404).json({ error: true, message: 'City not found in specified state' });
    }
    
    // Get property counts for this city
    const propertyCounts = await Property.aggregate([
      { $match: { 'location.city': { $regex: normalizedCity, $options: 'i' } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Format property counts
    const propertyStats = {
      total: 0,
      available: 0,
      auction: 0,
      pending: 0,
      sold: 0
    };
    
    propertyCounts.forEach(item => {
      propertyStats[item._id] = item.count;
      propertyStats.total += item.count;
    });
    
    // Get DRAH property count
    const drahCount = await Property.countDocuments({
      'location.city': { $regex: normalizedCity, $options: 'i' },
      isForDRAH: true
    });
    
    res.json({
      city: normalizedCity,
      ...data,
      propertyStats,
      drahCount
    });
  } catch (err) {
    console.error('Error getting city information:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get nearby properties
router.get('/nearby', async (req, res) => {
  try {
    const { propertyId, radius = 5, limit = 5 } = req.query;
    
    // Find the reference property
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }
    
    // Check if property has coordinates
    if (!property.location.coordinates || !property.location.coordinates.lat || !property.location.coordinates.lng) {
      // Fall back to zip code search
      const nearbyProperties = await Property.find({
        _id: { $ne: propertyId },
        'location.zipCode': property.location.zipCode
      }).limit(Number(limit));
      
      return res.json(nearbyProperties);
    }
    
    // Convert radius from miles to meters (1 mile = 1609.34 meters)
    const radiusInMeters = Number(radius) * 1609.34;
    
    // Find nearby properties
    const nearbyProperties = await Property.find({
      _id: { $ne: propertyId },
      'location.coordinates': {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [property.location.coordinates.lng, property.location.coordinates.lat]
          },
          $maxDistance: radiusInMeters
        }
      }
    }).limit(Number(limit));
    
    res.json(nearbyProperties);
  } catch (err) {
    console.error('Error finding nearby properties:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Search properties and auctions by keyword
router.get('/keyword', async (req, res) => {
  try {
    const { query, type = 'all', limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: true, message: 'Search query is required' });
    }
    
    const results = {};
    
    // Search properties
    if (type === 'all' || type === 'property') {
      results.properties = await Property.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { 'features': { $regex: query, $options: 'i' } }
        ]
      }).limit(Number(limit));
    }
    
    // Search auctions
    if (type === 'all' || type === 'auction') {
      const auctions = await Auction.find({
        status: 'active'
      }).populate('property').limit(50);
      
      // Filter auctions by property details
      results.auctions = auctions.filter(auction => {
        const property = auction.property;
        if (!property) return false;
        
        return (
          property.title?.toLowerCase().includes(query.toLowerCase()) ||
          property.description?.toLowerCase().includes(query.toLowerCase()) ||
          property.features?.some(f => f.toLowerCase().includes(query.toLowerCase()))
        );
      }).slice(0, Number(limit));
    }
    
    res.json(results);
  } catch (err) {
    console.error('Error searching by keyword:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

module.exports = router;
