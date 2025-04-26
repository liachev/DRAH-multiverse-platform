const express = require('express');
const router = express.Router();
const Property = require('../../models/Property');

// Get city resources for a property
router.get('/property/:propertyId/resources', async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Find the property
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }
    
    // If property already has resources, return them
    if (property.resources && property.resources.length > 0) {
      return res.json(property.resources);
    }
    
    // Otherwise, generate resources based on location
    const zipCode = property.location.zipCode;
    const city = property.location.city;
    
    // Generate resource links based on location
    const resources = [
      {
        type: 'assessor',
        name: `${property.location.county || 'County'} Assessor's Office`,
        url: `https://assessor.${(property.location.county || 'county').toLowerCase().replace(' ', '')}.gov`,
        description: 'Property assessment records and tax information'
      },
      {
        type: 'tax',
        name: `${property.location.county || 'County'} Tax Office`,
        url: `https://tax.${(property.location.county || 'county').toLowerCase().replace(' ', '')}.gov`,
        description: 'Tax payment and property tax information'
      },
      {
        type: 'permits',
        name: `${city || 'City'} Building Permits`,
        url: `https://permits.${(city || 'city').toLowerCase().replace(' ', '')}.gov`,
        description: 'Information about building permits and regulations'
      },
      {
        type: 'gis',
        name: `${property.location.county || 'County'} GIS Maps`,
        url: `https://gis.${(property.location.county || 'county').toLowerCase().replace(' ', '')}.gov`,
        description: 'Geographic Information System maps for the area'
      },
      {
        type: 'zoning',
        name: `${city || 'City'} Zoning Information`,
        url: `https://zoning.${(city || 'city').toLowerCase().replace(' ', '')}.gov`,
        description: 'Details about zoning regulations and restrictions'
      },
      {
        type: 'aec_drah',
        name: 'AEC DRAH Construction Services',
        url: '/aec-drah/services',
        description: 'Design and build services with up to 10% savings on market prices',
        isInternal: true
      }
    ];
    
    // Update property with resources
    property.resources = resources;
    await property.save();
    
    res.json(resources);
  } catch (err) {
    console.error('Error getting property resources:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get specific resource type for a property
router.get('/property/:propertyId/resources/:resourceType', async (req, res) => {
  try {
    const { propertyId, resourceType } = req.params;
    
    // Find the property
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }
    
    // Find the specific resource
    const resource = property.resources?.find(r => r.type === resourceType);
    
    if (!resource) {
      return res.status(404).json({ error: true, message: 'Resource not found' });
    }
    
    res.json(resource);
  } catch (err) {
    console.error('Error getting specific resource:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get resources by zip code
router.get('/zipcode/:zipCode/resources', async (req, res) => {
  try {
    const { zipCode } = req.params;
    
    // Validate zip code format
    if (!/^\d{5}$/.test(zipCode)) {
      return res.status(400).json({ error: true, message: 'Invalid zip code format' });
    }
    
    // Map zip codes to cities and counties (for demonstration)
    const zipMapping = {
      '70032': { city: 'St. Bernard Parish', county: 'St. Bernard' },
      '70043': { city: 'Chalmette', county: 'St. Bernard' },
      '70075': { city: 'Meraux', county: 'St. Bernard' },
      '70092': { city: 'Violet', county: 'St. Bernard' },
      // Default for other zip codes
      'default': { city: 'New Orleans', county: 'Orleans' }
    };
    
    const mapping = zipMapping[zipCode] || zipMapping['default'];
    const { city, county } = mapping;
    
    // Generate resource links based on location
    const resources = [
      {
        type: 'assessor',
        name: `${county} County Assessor`,
        url: `https://assessor.${county.toLowerCase().replace(' ', '')}.gov`,
        description: 'Property assessment records and tax information'
      },
      {
        type: 'tax',
        name: `${county} County Tax Office`,
        url: `https://tax.${county.toLowerCase().replace(' ', '')}.gov`,
        description: 'Tax payment and property tax information'
      },
      {
        type: 'permits',
        name: `${city} Building Permits`,
        url: `https://permits.${city.toLowerCase().replace(' ', '')}.gov`,
        description: 'Information about building permits and regulations'
      },
      {
        type: 'gis',
        name: `${county} County GIS Maps`,
        url: `https://gis.${county.toLowerCase().replace(' ', '')}.gov`,
        description: 'Geographic Information System maps for the area'
      },
      {
        type: 'zoning',
        name: `${city} Zoning Information`,
        url: `https://zoning.${city.toLowerCase().replace(' ', '')}.gov`,
        description: 'Details about zoning regulations and restrictions'
      },
      {
        type: 'aec_drah',
        name: 'AEC DRAH Construction Services',
        url: '/aec-drah/services',
        description: 'Design and build services with up to 10% savings on market prices',
        isInternal: true
      }
    ];
    
    res.json(resources);
  } catch (err) {
    console.error('Error getting zip code resources:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get AEC DRAH construction services information
router.get('/aec-drah/services', async (req, res) => {
  try {
    // This would be expanded with actual service information from a database
    const services = {
      name: 'AEC DRAH Construction Services',
      description: 'Professional design and construction services for disaster recovery and affordable housing',
      discount: '10% below market prices',
      services: [
        {
          name: 'Architectural Design',
          description: 'Custom home designs optimized for disaster resilience',
          estimatedTimeframe: '2-4 weeks',
          includedInPackage: true
        },
        {
          name: 'Engineering Services',
          description: 'Structural engineering with focus on durability and safety',
          estimatedTimeframe: '1-2 weeks',
          includedInPackage: true
        },
        {
          name: 'Construction',
          description: 'Full construction services from foundation to finishing',
          estimatedTimeframe: '3-6 months depending on size',
          includedInPackage: true
        },
        {
          name: 'Permit Management',
          description: 'Handling all necessary permits and approvals',
          estimatedTimeframe: '2-4 weeks',
          includedInPackage: true
        }
      ],
      packages: [
        {
          name: 'Standard Package',
          description: 'Basic home construction with standard finishes',
          priceRange: '$150-200 per square foot',
          features: [
            'Energy-efficient design',
            'Standard appliances',
            'Basic finishes',
            'Hurricane-resistant construction'
          ]
        },
        {
          name: 'Premium Package',
          description: 'Enhanced home construction with upgraded features',
          priceRange: '$200-250 per square foot',
          features: [
            'Energy-efficient design',
            'Premium appliances',
            'Upgraded finishes',
            'Hurricane-resistant construction',
            'Smart home features'
          ]
        },
        {
          name: 'Custom Package',
          description: 'Fully customized home based on specific requirements',
          priceRange: '$250+ per square foot',
          features: [
            'Completely customized design',
            'Premium appliances',
            'Luxury finishes',
            'Hurricane-resistant construction',
            'Smart home integration',
            'Sustainable features'
          ]
        }
      ],
      process: [
        {
          step: 1,
          name: 'Initial Consultation',
          description: 'Meet with our team to discuss your needs and preferences'
        },
        {
          step: 2,
          name: 'Design Phase',
          description: 'Work with architects to create your custom home design'
        },
        {
          step: 3,
          name: 'Engineering and Permits',
          description: 'Finalize structural details and obtain necessary permits'
        },
        {
          step: 4,
          name: 'Construction',
          description: 'Build your home with regular progress updates'
        },
        {
          step: 5,
          name: 'Final Inspection',
          description: 'Complete quality checks and prepare for move-in'
        }
      ],
      contactInformation: {
        phone: '(555) 123-4567',
        email: 'services@aecdrah.com',
        website: 'https://aecdrah.com'
      }
    };
    
    res.json(services);
  } catch (err) {
    console.error('Error getting AEC DRAH services:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Request AEC DRAH construction quote for a property
router.post('/property/:propertyId/aec-drah/quote', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { 
      userId, 
      packageType = 'Standard', 
      squareFootage, 
      bedrooms, 
      bathrooms,
      additionalFeatures = []
    } = req.body;
    
    // Find the property
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }
    
    // Validate property is a vacant lot
    if (property.type !== 'vacant_lot') {
      return res.status(400).json({ error: true, message: 'AEC DRAH services are only available for vacant lots' });
    }
    
    // Calculate estimated price based on package and square footage
    let pricePerSquareFoot;
    switch (packageType) {
      case 'Premium':
        pricePerSquareFoot = 225; // $200-250 range
        break;
      case 'Custom':
        pricePerSquareFoot = 275; // $250+ range
        break;
      case 'Standard':
      default:
        pricePerSquareFoot = 175; // $150-200 range
        break;
    }
    
    const estimatedMarketPrice = pricePerSquareFoot * squareFootage;
    const discountedPrice = estimatedMarketPrice * 0.9; // 10% discount
    
    // Calculate estimated timeline
    const estimatedTimelineMonths = Math.max(3, Math.ceil(squareFootage / 1000) * 2);
    
    // Generate quote
    const quote = {
      property: {
        id: property._id,
        address: property.location.address,
        city: property.location.city,
        state: property.location.state,
        zipCode: property.location.zipCode
      },
      specifications: {
        packageType,
        squareFootage,
        bedrooms,
        bathrooms,
        additionalFeatures
      },
      pricing: {
        estimatedMarketPrice,
        discountedPrice,
        savings: estimatedMarketPrice - discountedPrice,
        savingsPercentage: '10%'
      },
      timeline: {
        estimatedMonths: estimatedTimelineMonths,
        designPhase: '2-4 weeks',
        permitting: '2-4 weeks',
        construction: `${estimatedTimelineMonths - 2} months`
      },
      quoteId: `AEC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
    
    res.json({
      message: 'Construction quote generated successfully',
      quote
    });
  } catch (err) {
    console.error('Error generating AEC DRAH quote:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get all resource types
router.get('/resource-types', async (req, res) => {
  try {
    const resourceTypes = [
      {
        type: 'assessor',
        name: 'County Assessor',
        description: 'Property assessment records and tax information',
        icon: 'file-text'
      },
      {
        type: 'tax',
        name: 'Tax Office',
        description: 'Tax payment and property tax information',
        icon: 'dollar-sign'
      },
      {
        type: 'permits',
        name: 'Building Permits',
        description: 'Information about building permits and regulations',
        icon: 'clipboard'
      },
      {
        type: 'gis',
        name: 'GIS Maps',
        description: 'Geographic Information System maps for the area',
        icon: 'map'
      },
      {
        type: 'zoning',
        name: 'Zoning Information',
        description: 'Details about zoning regulations and restrictions',
        icon: 'layers'
      },
      {
        type: 'aec_drah',
        name: 'AEC DRAH Construction',
        description: 'Design and build services with up to 10% savings on market prices',
        icon: 'home',
        isInternal: true
      }
    ];
    
    res.json(resourceTypes);
  } catch (err) {
    console.error('Error getting resource types:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

module.exports = router;
