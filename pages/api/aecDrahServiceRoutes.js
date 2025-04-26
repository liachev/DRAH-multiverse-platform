const express = require('express');
const router = express.Router();
const Property = require('../../models/Property');
const User = require('../../models/User');
const mongoose = require('mongoose');

// Create AEC DRAH Construction Service model
const AECDRAHServiceSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageType: {
    type: String,
    enum: ['Standard', 'Premium', 'Custom'],
    default: 'Standard'
  },
  specifications: {
    squareFootage: Number,
    bedrooms: Number,
    bathrooms: Number,
    additionalFeatures: [String]
  },
  pricing: {
    estimatedMarketPrice: Number,
    discountedPrice: Number,
    savings: Number,
    savingsPercentage: String
  },
  timeline: {
    estimatedMonths: Number,
    designPhase: String,
    permitting: String,
    construction: String
  },
  status: {
    type: String,
    enum: ['quote', 'contract_pending', 'contract_signed', 'design', 'permitting', 'construction', 'completed', 'cancelled'],
    default: 'quote'
  },
  quoteId: {
    type: String,
    required: true,
    unique: true
  },
  validUntil: Date,
  contractSignedDate: Date,
  designStartDate: Date,
  constructionStartDate: Date,
  estimatedCompletionDate: Date,
  actualCompletionDate: Date,
  designDocuments: [{
    name: String,
    url: String,
    uploadDate: Date
  }],
  constructionUpdates: [{
    date: Date,
    description: String,
    completionPercentage: Number,
    images: [String]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const AECDRAHService = mongoose.model('AECDRAHService', AECDRAHServiceSchema);

// Get AEC DRAH construction services information
router.get('/services', async (req, res) => {
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
      },
      testimonials: [
        {
          name: "John D.",
          location: "St. Bernard Parish",
          quote: "After losing our home in a hurricane, AEC DRAH built us a beautiful, resilient new home at an affordable price.",
          rating: 5
        },
        {
          name: "Maria S.",
          location: "Chalmette",
          quote: "The 10% savings made a huge difference in our budget. Our new home is better than we could have imagined.",
          rating: 5
        },
        {
          name: "Robert T.",
          location: "Meraux",
          quote: "From design to completion, the AEC DRAH team was professional and efficient. Our home was completed ahead of schedule.",
          rating: 4
        }
      ]
    };
    
    res.json(services);
  } catch (err) {
    console.error('Error getting AEC DRAH services:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Request AEC DRAH construction quote for a property
router.post('/quote', async (req, res) => {
  try {
    const { 
      propertyId, 
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
    
    // Generate quote ID
    const quoteId = `AEC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create new AEC DRAH service record
    const newService = new AECDRAHService({
      propertyId,
      userId,
      packageType,
      specifications: {
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
      status: 'quote',
      quoteId,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
    
    const savedService = await newService.save();
    
    // Generate quote response
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
      quoteId,
      serviceId: savedService._id,
      validUntil: savedService.validUntil
    };
    
    res.status(201).json({
      message: 'Construction quote generated successfully',
      quote
    });
  } catch (err) {
    console.error('Error generating AEC DRAH quote:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Accept quote and sign contract
router.post('/quote/:quoteId/accept', async (req, res) => {
  try {
    const { quoteId } = req.params;
    const { userId, paymentMethod, downPayment } = req.body;
    
    // Find the service by quote ID
    const service = await AECDRAHService.findOne({ quoteId });
    
    if (!service) {
      return res.status(404).json({ error: true, message: 'Quote not found' });
    }
    
    // Validate user owns the service
    if (service.userId.toString() !== userId) {
      return res.status(403).json({ error: true, message: 'Unauthorized access to this quote' });
    }
    
    // Check if quote is still valid
    if (new Date() > service.validUntil) {
      return res.status(400).json({ error: true, message: 'Quote has expired' });
    }
    
    // Check if quote is in the correct status
    if (service.status !== 'quote') {
      return res.status(400).json({ error: true, message: `Quote is already in ${service.status} status` });
    }
    
    // Process payment (this would integrate with a payment gateway in production)
    const paymentSuccessful = true; // Simulated payment processing
    
    if (!paymentSuccessful) {
      return res.status(400).json({ error: true, message: 'Payment processing failed' });
    }
    
    // Update service status
    service.status = 'contract_signed';
    service.contractSignedDate = new Date();
    service.designStartDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
    
    // Calculate estimated dates
    const designEndDate = new Date(service.designStartDate);
    designEndDate.setDate(designEndDate.getDate() + 28); // 4 weeks for design
    
    const permittingStartDate = new Date(designEndDate);
    const permittingEndDate = new Date(permittingStartDate);
    permittingEndDate.setDate(permittingEndDate.getDate() + 28); // 4 weeks for permitting
    
    service.constructionStartDate = new Date(permittingEndDate);
    
    const constructionEndDate = new Date(service.constructionStartDate);
    constructionEndDate.setMonth(constructionEndDate.getMonth() + service.timeline.estimatedMonths - 2);
    
    service.estimatedCompletionDate = constructionEndDate;
    
    await service.save();
    
    // Get property details
    const property = await Property.findById(service.propertyId);
    
    res.json({
      message: 'Contract signed successfully',
      service: {
        id: service._id,
        quoteId: service.quoteId,
        status: service.status,
        property: {
          id: property._id,
          address: property.location.address,
          city: property.location.city,
          state: property.location.state,
          zipCode: property.location.zipCode
        },
        timeline: {
          contractSignedDate: service.contractSignedDate,
          designStartDate: service.designStartDate,
          constructionStartDate: service.constructionStartDate,
          estimatedCompletionDate: service.estimatedCompletionDate
        }
      }
    });
  } catch (err) {
    console.error('Error accepting quote:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get service details
router.get('/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const service = await AECDRAHService.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({ error: true, message: 'Service not found' });
    }
    
    // Get property details
    const property = await Property.findById(service.propertyId);
    
    // Get user details
    const user = await User.findById(service.userId).select('username email firstName lastName');
    
    res.json({
      service,
      property,
      user
    });
  } catch (err) {
    console.error('Error getting service details:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get user's services
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    
    // Build filter
    const filter = { userId };
    
    if (status) {
      filter.status = status;
    }
    
    const services = await AECDRAHService.find(filter).sort({ createdAt: -1 });
    
    // Get property details for each service
    const servicesWithDetails = await Promise.all(services.map(async (service) => {
      const property = await Property.findById(service.propertyId);
      
      return {
        ...service.toObject(),
        property: {
          id: property._id,
          address: property.location.address,
          city: property.location.city,
          state: property.location.state,
          zipCode: property.location.zipCode,
          type: property.type
        }
      };
    }));
    
    res.json(servicesWithDetails);
  } catch (err) {
    console.error('Error getting user services:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Update construction progress
router.post('/:serviceId/progress', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { description, completionPercentage, images = [] } = req.body;
    
    const service = await AECDRAHService.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({ error: true, message: 'Service not found' });
    }
    
    // Validate service is in construction phase
    if (service.status !== 'construction') {
      return res.status(400).json({ error: true, message: 'Service is not in construction phase' });
    }
    
    // Add construction update
    service.constructionUpdates.push({
      date: new Date(),
      description,
      completionPercentage,
      images
    });
    
    // Update status if construction is complete
    if (completionPercentage >= 100) {
      service.status = 'completed';
      service.actualCompletionDate = new Date();
    }
    
    await service.save();
    
    res.json({
      message: 'Construction progress updated successfully',
      service
    });
  } catch (err) {
    console.error('Error updating construction progress:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Upload design document
router.post('/:serviceId/design-
(Content truncated due to size limit. Use line ranges to read in chunks)