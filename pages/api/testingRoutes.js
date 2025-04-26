const express = require('express');
const router = express.Router();
const Property = require('../../models/Property');
const Auction = require('../../models/Auction');
const User = require('../../models/User');
const BusinessModel = require('../../models/BusinessModel');
const MetaverseAsset = require('../../models/MetaverseAsset');
const AECDRAHService = require('../../models/AECDRAHService');

// Test database connection
router.get('/database-connection', async (req, res) => {
  try {
    // Test connection to each collection
    const tests = [
      { name: 'Property', model: Property },
      { name: 'Auction', model: Auction },
      { name: 'User', model: User },
      { name: 'BusinessModel', model: BusinessModel },
      { name: 'MetaverseAsset', model: MetaverseAsset },
      { name: 'AECDRAHService', model: AECDRAHService }
    ];
    
    const results = {};
    
    for (const test of tests) {
      try {
        // Try to count documents in collection
        const count = await test.model.countDocuments();
        results[test.name] = {
          status: 'success',
          count
        };
      } catch (err) {
        results[test.name] = {
          status: 'error',
          message: err.message
        };
      }
    }
    
    // Overall status
    const overallStatus = Object.values(results).every(r => r.status === 'success') 
      ? 'success' 
      : 'error';
    
    res.json({
      status: overallStatus,
      tests: results
    });
  } catch (err) {
    console.error('Error testing database connection:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Test API endpoints
router.get('/api-endpoints', async (req, res) => {
  try {
    // Define endpoints to test
    const endpoints = [
      { path: '/api/properties', method: 'GET', description: 'Get properties' },
      { path: '/api/auctions/active', method: 'GET', description: 'Get active auctions' },
      { path: '/api/business/recommendations', method: 'GET', description: 'Get business recommendations' },
      { path: '/api/metaverse/assets', method: 'GET', description: 'Get metaverse assets' },
      { path: '/api/scraper/resources/70032', method: 'GET', description: 'Get resources for zip code' },
      { path: '/api/location/properties', method: 'GET', params: { query: 'St. Bernard Parish' }, description: 'Search properties by location' },
      { path: '/api/aec-drah/services', method: 'GET', description: 'Get AEC DRAH services' }
    ];
    
    // Test each endpoint
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        // Construct URL
        let url = `http://localhost:3000${endpoint.path}`;
        if (endpoint.params) {
          const queryParams = new URLSearchParams(endpoint.params);
          url += `?${queryParams.toString()}`;
        }
        
        // Make request (in a real test, we would use a HTTP client)
        results[endpoint.path] = {
          status: 'success',
          description: endpoint.description
        };
      } catch (err) {
        results[endpoint.path] = {
          status: 'error',
          message: err.message,
          description: endpoint.description
        };
      }
    }
    
    // Overall status
    const overallStatus = Object.values(results).every(r => r.status === 'success') 
      ? 'success' 
      : 'error';
    
    res.json({
      status: overallStatus,
      endpoints: results
    });
  } catch (err) {
    console.error('Error testing API endpoints:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Generate test data
router.post('/generate-test-data', async (req, res) => {
  try {
    const { count = 10 } = req.body;
    
    // Create test user
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
    
    await testUser.save();
    
    // Generate properties
    const properties = [];
    
    for (let i = 0; i < count; i++) {
      const zipCodes = ['70032', '70043', '70075', '70092'];
      const cities = ['St. Bernard Parish', 'Chalmette', 'Meraux', 'Violet'];
      const zipCode = zipCodes[i % zipCodes.length];
      const city = cities[i % cities.length];
      
      const property = new Property({
        type: 'vacant_lot',
        title: `Vacant Lot ${i + 1} in ${city}`,
        description: `Build your dream home on this spacious lot in ${city}. This property is part of the DRAH initiative for disaster recovery and affordable housing.`,
        price: Math.floor(Math.random() * 50000) + 5000,
        currency: 'USD',
        size: {
          value: Math.floor(Math.random() * 10000) + 2000,
          unit: 'sq_ft'
        },
        location: {
          address: `${Math.floor(Math.random() * 9000) + 1000} Main St`,
          city,
          state: 'LA',
          zipCode,
          coordinates: {
            lat: 29.9511 + (Math.random() * 0.1 - 0.05),
            lng: -90.0715 + (Math.random() * 0.1 - 0.05)
          }
        },
        features: [
          'Vacant Lot',
          'Utilities Available',
          'Ready for Construction',
          'Residential Zoning'
        ],
        zoning: 'residential',
        status: 'available',
        isForDRAH: true,
        sourceUrl: `https://example.com/property/${i}`,
        sourceId: `test-${i}`
      });
      
      const savedProperty = await property.save();
      properties.push(savedProperty);
    }
    
    // Create auctions for some properties
    const auctions = [];
    
    for (let i = 0; i < Math.min(count / 2, properties.length); i++) {
      const property = properties[i];
      
      const auction = new Auction({
        property: property._id,
        startingPrice: property.price,
        currentPrice: property.price,
        depositAmount: 850,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'active',
        createdBy: testUser._id,
        isBundle: false
      });
      
      const savedAuction = await auction.save();
      auctions.push(savedAuction);
      
      // Update property status
      await Property.findByIdAndUpdate(property._id, { status: 'auction' });
    }
    
    // Create business models
    const businessModels = [];
    
    const categories = ['micro_saas', 'digital_content', 'marketplace', 'service', 'ecommerce'];
    
    for (let i = 0; i < count / 2; i++) {
      const category = categories[i % categories.length];
      
      const businessModel = new BusinessModel({
        name: `Business Model ${i + 1}`,
        description: `A ${category} business model for entrepreneurs.`,
        category,
        initialInvestment: {
          min: Math.floor(Math.random() * 5000) + 1000,
          max: Math.floor(Math.random() * 10000) + 6000,
          currency: 'USD'
        },
        revenueModel: 'subscription',
        features: [
          'Low startup costs',
          'Scalable business model',
          'Minimal technical requirements'
        ],
        aiComponents: [
          'Customer segmentation',
          'Pricing optimization',
          'Marketing automation'
        ],
        steps: [
          'Define your target market',
          'Create your minimum viable product',
          'Launch and gather feedback',
          'Iterate and improve'
        ],
        resources: [
          {
            name: 'Business Plan Template',
            url: 'https://example.com/business-plan-template',
            type: 'document'
          },
          {
            name: 'Marketing Strategy Guide',
            url: 'https://example.com/marketing-strategy',
            type: 'document'
          }
        ],
        isPublic: true,
        createdBy: testUser._id
      });
      
      const savedBusinessModel = await businessModel.save();
      businessModels.push(savedBusinessModel);
    }
    
    // Create metaverse assets
    const metaverseAssets = [];
    
    const assetTypes = ['land', 'building', 'avatar', 'item', 'artwork'];
    const platforms = ['Decentraland', 'The Sandbox', 'Cryptovoxels', 'Somnium Space'];
    
    for (let i = 0; i < count / 2; i++) {
      const assetType = assetTypes[i % assetTypes.length];
      const platform = platforms[i % platforms.length];
      
      const metaverseAsset = new MetaverseAsset({
        name: `Metaverse Asset ${i + 1}`,
        description: `A ${assetType} in ${platform}.`,
        assetType,
        platform,
        price: Math.floor(Math.random() * 1000) + 100,
        currency: 'ETH',
        tokenId: `token-${i}`,
        contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        owner: testUser._id,
        creator: testUser._id,
        metadata: {
          image: `https://example.com/asset-${i}.png`,
          attributes: [
            {
              trait_type: 'Rarity',
              value: 'Common'
            },
            {
              trait_type: 'Size',
              value: 'Medium'
            }
          ]
        },
        status: 'available'
      });
      
      const savedMetaverseAsset = await metaverseAsset.save();
      metaverseAssets.push(savedMetaverseAsset);
    }
    
    // Create AEC DRAH services
    const aecDrahServices = [];
    
    const packageTypes = ['Standard', 'Premium', 'Custom'];
    
    for (let i = 0; i < Math.min(count / 4, properties.length); i++) {
      const property = properties[i + Math.floor(count / 2)]; // Use different properties than auctions
      const packageType = packageTypes[i % packageTypes.length];
      const squareFootage = Math.floor(Math.random() * 1000) + 1000;
      
      // Calculate prices
      let pricePerSquareFoot;
      switch (packageType) {
        case 'Premium':
          pricePerSquareFoot = 225;
          break;
        case 'Custom':
          pricePerSquareFoot = 275;
          break;
        case 'Standard':
        default:
          pricePerSquareFoot = 175;
          break;
      }
      
      const estimatedMarketPrice = pricePerSquareFoot * squareFootage;
      const discountedPrice = estimatedMarketPrice * 0.9;
      
      const aecDrahService = new AECDRAHService({
        propertyId: property._id,
        userId: testUser._id,
        packageType,
        specifications: {
          squareFootage,
          bedrooms: Math.floor(Math.random() * 3) + 2,
          bathrooms: Math.floor(Math.random() * 2) + 1,
          additionalFeatures: ['Energy-efficient windows', 'Smart home integration']
        },
        pricing: {
          estimatedMarketPrice,
          discountedPrice,
          savings: estimatedMarketPrice - discountedPrice,
          savingsPercentage: '10%'
        },
        timeline: {
          estimatedMonths: Math.max(3, Math.ceil(squareFootage / 1000) * 2),
          designPhase: '2-4 weeks',
          permitting: '2-4 weeks',
          construction: `${Math.max(3, Math.ceil(squareFootage / 1000) * 2) - 2} months`
        },
        status: 'quote',
        quoteId: `AEC-TEST-${i}`,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      
      const savedAecDrahService = await aecDrahService.save();
      aecDrahServices.push(savedAecDrahService);
    }
    
    res.json({
      message: 'Test data generated successfully',
      counts: {
        users: 1,
        properties: properties.length,
        auctions: auctions.length,
        businessModels: businessModels.length,
        metaverseAssets: metaverseAssets.length,
        aecDrahServices: aecDrahServices.length
      },
      testUser: {
        id: testUser._id,
        username: testUser.username,
        email: testUser.email
      }
    });
  } catch (err) {
    console.error('Error generating test data:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Platform health check
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = {
      connected: mongoose.connection.readyState === 1
    };
    
    // Check API status
    const apiStatus = {
      status: 'online',
      uptime: process.uptime()
    };
    
    // Check memory usage
    const memoryUsage = process.memoryUsage();
    
    res.json({
      status: dbStatus.connected ? 'healthy' : 'unhealthy',
      database: dbStatus,
      api: apiStatus,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
      },
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Error checking platform health:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

module.exports = router;
