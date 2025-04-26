/**
 * Business API - Serverless Functions
 * Handles all business modeling operations for the Multiverse Platform
 */

const mongoose = require('mongoose');
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('../config/database');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed' 
    });
  }
});

// Load models
const BusinessModel = mongoose.model('BusinessModel');
const User = mongoose.model('User');

/**
 * @route   GET /api/business/models
 * @desc    Get all business models with filtering
 * @access  Private (would require auth middleware in production)
 */
app.get('/api/business/models', async (req, res) => {
  try {
    const { 
      businessType, 
      owner, 
      isHumanitarian,
      stage,
      limit = 10,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {};

    // Business type filter
    if (businessType) {
      filter.businessType = businessType;
    }

    // Owner filter
    if (owner) {
      filter.owner = owner;
    }

    // Humanitarian focus filter
    if (isHumanitarian === 'true') {
      filter.isHumanitarian = true;
    }

    // Stage filter
    if (stage) {
      filter.stage = stage;
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const models = await BusinessModel.find(filter)
      .populate('owner', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await BusinessModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: models.length,
      total,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit))
      },
      data: models
    });
  } catch (error) {
    console.error('Error fetching business models:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/business/models/:id
 * @desc    Get business model by ID
 * @access  Private (would require auth middleware in production)
 */
app.get('/api/business/models/:id', async (req, res) => {
  try {
    const model = await BusinessModel.findById(req.params.id)
      .populate('owner', 'firstName lastName email')
      .populate('collaborators', 'firstName lastName email');
    
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Business model not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: model
    });
  } catch (error) {
    console.error('Error fetching business model:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/business/models
 * @desc    Create a new business model
 * @access  Private (would require auth middleware in production)
 */
app.post('/api/business/models', async (req, res) => {
  try {
    const { ownerId, ...modelData } = req.body;
    
    // Check if owner exists
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }
    
    // Create new business model
    const newModel = new BusinessModel({
      owner: ownerId,
      ...modelData,
      createdAt: new Date()
    });
    
    const savedModel = await newModel.save();
    
    // Add model to user's businessModels
    owner.businessModels.push(savedModel._id);
    await owner.save();
    
    return res.status(201).json({
      success: true,
      data: savedModel
    });
  } catch (error) {
    console.error('Error creating business model:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/business/models/:id
 * @desc    Update a business model
 * @access  Private (would require auth middleware in production)
 */
app.put('/api/business/models/:id', async (req, res) => {
  try {
    const updatedModel = await BusinessModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedModel) {
      return res.status(404).json({
        success: false,
        message: 'Business model not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: updatedModel
    });
  } catch (error) {
    console.error('Error updating business model:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/business/models/:id/milestones
 * @desc    Add milestone to business model
 * @access  Private (would require auth middleware in production)
 */
app.post('/api/business/models/:id/milestones', async (req, res) => {
  try {
    const { title, description, targetDate, status = 'pending' } = req.body;
    
    const model = await BusinessModel.findById(req.params.id);
    
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Business model not found'
      });
    }
    
    model.milestones.push({
      title,
      description,
      targetDate,
      status,
      createdAt: new Date()
    });
    
    await model.save();
    
    return res.status(200).json({
      success: true,
      message: 'Milestone added successfully',
      data: model
    });
  } catch (error) {
    console.error('Error adding milestone:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/business/models/:id/milestones/:milestoneId
 * @desc    Update milestone status
 * @access  Private (would require auth middleware in production)
 */
app.put('/api/business/models/:id/milestones/:milestoneId', async (req, res) => {
  try {
    const { status, completionDate } = req.body;
    
    const model = await BusinessModel.findById(req.params.id);
    
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Business model not found'
      });
    }
    
    const milestone = model.milestones.id(req.params.milestoneId);
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }
    
    milestone.status = status;
    
    if (status === 'completed' && completionDate) {
      milestone.completionDate = completionDate;
    }
    
    await model.save();
    
    return res.status(200).json({
      success: true,
      message: `Milestone status updated to ${status}`,
      data: model
    });
  } catch (error) {
    console.error('Error updating milestone status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/business/models/:id/collaborators
 * @desc    Add collaborator to business model
 * @access  Private (would require auth middleware in production)
 */
app.post('/api/business/models/:id/collaborators', async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const model = await BusinessModel.findById(req.params.id);
    
    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Business model not found'
      });
    }
    
    // Check if user is already a collaborator
    if (model.collaborators.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a collaborator'
      });
    }
    
    // Add collaborator
    model.collaborators.push(userId);
    model.collaboratorRoles.push({
      user: userId,
      role
    });
    
    await model.save();
    
    // Add model to user's collaboratingModels
    user.collaboratingModels.push(model._id);
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: 'Collaborator added successfully',
      data: model
    });
  } catch (error) {
    console.error('Error adding collaborator:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/business/models/user/:userId
 * @desc    Get business models for a specific user
 * @access  Private (would require auth middleware in production)
 */
app.get('/api/business/models/user/:userId', async (req, res) => {
  try {
    const models = await BusinessModel.find({ owner: req.params.userId })
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: models.length,
      data: models
    });
  } catch (error) {
    console.error('Error fetching user business models:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/business/models/collaborating/:userId
 * @desc    Get business models where user is a collaborator
 * @access  Private (would require auth middleware in production)
 */
app.get('/api/business/models/collaborating/:userId', async (req, res) => {
  try {
    const models = await BusinessModel.find({ collaborators: req.params.userId })
      .populate('owner', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: models.length,
      data: models
    });
  } catch (error) {
    console.error('Error fetching collaborating business models:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/business/recommendations
 * @desc    Get AI recommendations for business model
 * @access  Public
 */
app.post('/api/business/recommendations', async (req, res) => {
  try {
    const { businessType, stage, capitalRequired, isHumanitarian } = req.body;
    
    // Business type options
    const businessTypes = [
      'micro_saas', 
      'digital_content', 
      'sustainable_marketplace', 
      'service_business', 
      'ecommerce'
    ];
    
    // Stage options
    const stages = [
      'ideation',
      'validation',
      'development',
      'launch',
      'growth'
    ];
    
    // Validate inputs
    if (!businessTypes.includes(businessType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid business type'
      });
    }
    
    if (!stages.includes(stage)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stage'
      });
    }
    
    // AI recommendations based on business type
    const recommendations = {
      datafication: {
        micro_saas: 'Implement analytics to track user engagement and feature usage patterns.',
        digital_content: 'Use content performance metrics to guide future content creation.',
        sustainable_marketplace: 'Collect and analyze sustainability metrics for all products.',
        service_business: 'Track client satisfaction and service delivery metrics.',
        ecommerce: 'Analyze purchase patterns and customer behavior for inventory optimization.'
      },
      algorithm: {
        micro_saas: 'Develop recommendation algorithms to suggest features based on user behavior.',
        digital_content: 'Create content recommendation systems to increase engagement.',
        sustainable_marketplace: 'Build matching algorithms to connect consumers with ideal products.',
        service_business: 'Implement scheduling and resource allocation algorithms.',
        ecommerce: 'Develop personalized product recommendation engines.'
      },
      automation: {
        micro_saas: 'Automate onboarding, billing, and customer support processes.',
        digital_content: 'Set up automated content distribution across multiple platforms.',
        sustainable_marketplace: 'Automate seller verification and product sustainability scoring.',
        service_business: 'Create automated booking, follow-up, and feedback systems.',
        ecommerce: 'Implement automated inventory management and order fulfillment.'
      },
      innovation: {
        micro_saas: 'Focus on solving one specific problem exceptionally well.',
        digital_content: 'Experiment with emerging content formats and platforms.',
        sustainable_marketplace: 'Develop innovative sustainability verification methods.',
        service_business: 'Create proprietary service delivery methodologies.',
        ecommerce: 'Explore unique product bundling or subscription models.'
      }
    };
    
    // Buffett principles applied to selected business
    const buffettPrinciples = {
      valueInvesting: {
        title: 'Value Investing',
        description: 'Focus on businesses with intrinsic value that can generate consistent cash flow.',
        application: {
          micro_saas: 'Target niche markets with specific needs willing to pay for solutions.',
          digital_content: 'Create evergreen content that continues to generate value over time.',
          sustainable_marketplace: 'Focus on quality, sustainable products with lasting appeal.',
          service_business: 'Develop expertise in high-value services with recurring revenue potential.',
          ecommerce: 'Select products with strong margins and lasting customer appeal.'
        }
      },
      longTermFocus: {
        title: 'Long-Term Focus',
        description: 'Build for the long-term rather than seeking quick profits.',
        application: {
          micro_saas: 'Prioritize customer retention and lifetime value over rapid acquisition.',
          digital_content: 'Build a loyal audience base rather than chasing viral trends.',
          sustainable_marketplace: 'Establish trust and reputation in the sustainability space.',
          service_business: 'Focus on client relationships and repeat business.',
          ecommerce: 'Build a brand that stands for quality and customer satisfaction.'
        }
      },
      qualityOverQuantity: {
        title: 'Quality Over Quantity',
        description: 'Invest in fewer, higher-quality opportunities rather than diversifying too broadly.',
        application: {
          micro_saas: 'Master one core feature set before expanding to others.',
          digital_content: 'Create fewer, higher-quality pieces rather than high volume.',
          sustainable_marketplace: 'Curate products carefully rather than maximizing listings.',
          service_business: 'Specialize in a few services you can deliver exceptionally well.',
          ecommerce: 'Offer a carefully selected product range rather than endless options.'
        }
      }
    };
    
    // Milestones based on business stage
    const milestonesByStage = {
      ideation: [
        { title: 'Market Research', description: 'Validate market need and identify target customers' },
        { title: 'Competitive Analysis', description: 'Analyze existing solutions and identify gaps' },
        { title: 'Value Proposition', description: 'Define unique value proposition and differentiators' },
        { title: 'Business Model Canvas', description: 'Create initial business model canvas' }
      ],
      validation: [
        { title: 'Minimum Viable Product', description: 'Develop MVP to test core assumptions' },
        { title: 'Customer Interviews', description: 'Conduct interviews with potential customers' },
        { title: 'Landing Page', description: 'Create landing page to gauge interest' },
        { title: 'Pricing Strategy', description: 'Test different pricing models' }
      ],
      development: [
        { title: 'Product Development', description: 'Build full version of product or service' },
        { title: 'Operations Setup', description: 'Establish operational processes and tools' },
        { title: 'Legal Structure', description: 'Set up legal entity and necessary agreements' },
        { title: 'Financial Planning', description: 'Create detailed financial projections' }
      ],
      launch: [
        { title: 'Marketing Plan', description: 'Develop marketing strategy and launch campaign' },
        { title: 'Customer Acquisition', description: 'Implement initial customer acquisition channels' },
        { title: 'Feedback Loop', description: 'Establish system for collecting customer feedback' },
        { title: 'Support System', description: 'Set up customer support processes' }
      ],
      growth: [
        { title: 'Scaling Operations', description: 'Optimize processes for handling increased volume' },
        { title: 'Team Expansion', description: 'Hire key roles to support growth' },
        { title: 'Marketing Optimization', description: 'Refine marketing channels based on performance' },
        { title: 'Product Iteration', description: 'Enhance product based on customer feedback' }
      ]
    };
    
    // Business type details
    const businessTypeDetails = {
      micro_saas: { 
        name: 'Micro-SaaS', 
        description: 'Small, focused software as a service businesses with low overhead and high margins.',
        capitalRange: '$3,000 - $10,000',
        timeToMarket: '3-6 months',
        scalability: 'High'
      },
      digital_content: { 
        name: 'Digital Content Creation', 
        description: 'Creating and monetizing digital content through various platforms and channels.',
        capitalRange: '$1,000 - $5,000',
        timeToMarket: '1-3 months',
        scalability: 'Medium'
      },
      sustainable_marketplace: { 
        name: 'Sustainable Marketplace', 
        description: 'Online marketplace connecting eco-friendly products with conscious consumers.',
        capitalRange: '$5,000 - $15,000',
        timeToMarket: '4-8 months',
        scalability: 'High'
      },
      service_business: { 
        name: 'Service Business', 
        description: 'Providing specialized services to businesses or consumers with minimal startup costs.',
        capitalRange: '$2,000 - $8,000',
        timeToMarket: '1-2 months',
        scalability: 'Medium'
      },
      ecommerce: { 
        name: 'E-Commerce', 
        description: 'Selling physical or digital products online with dropshipping or minimal inventory.',
        capitalRange: '$3,000 - $12,000',
        timeToMarket: '2-4 months',
        scalability: 'Medium-High'
      }
    };
    
    // Generate AI insight based on inputs
    let aiInsight = '';
    
    if (stage === 'ideation') {
      aiInsight = `For a ${businessTypeDetails[businessType].name} business with $${capitalRequired.toLocaleString()} starting capital, focus on validating your concept with minimal investment. ${isHumanitarian ? 'Consider how your business can address global challenges while remaining financially sustainable.' : ''}`;
    } else if (stage === 'validation') {
      aiInsight = `For a ${businessTypeDetails[businessType].name} business with $${capitalRequired.toLocaleString()} starting capital, focus on gathering customer feedback and refining your offering. ${isHumanitarian ? 'Test how effectively your solution addresses the humanitarian challenges you've identified.' : ''}`;
    } else if (stage === 'development') {
      aiInsight = `For a ${businessTypeDetails[businessType].name} business with $${capitalRequired.toLocaleString()} starting capital, focus on building scalable systems and processes. ${isHumanitarian ? 'Ensure your development prioritizes both impact and sustainability.' : ''}`;
    } else if (stage === 'launch') {
      aiInsight = `For a ${businessTypeDetails[businessType].name} business with $${capitalRequired.toLocaleString()} starting capital, focus on efficient customer acquisition channels. ${isHumanitarian ? 'Communicate your humanitarian mission clearly in your marketing.' : ''}`;
    } else {
      aiInsight = `For a ${businessTypeDetails[businessType].name} business with $${capitalRequired.toLocaleString()} starting capital, focus on optimizing operations and exploring expansion opportunities. ${isHumanitarian ? 'Measure and report on your humanitarian impact alongside financial metrics.' : ''}`;
    }
    
    return res.status(200).json({
      success: true,
      data: {
        businessType: businessTypeDetails[businessType],
        recommendations: {
          datafication: recommendations.datafication[businessType],
          algorithm: recommendations.algorithm[businessType],
          automation: recommendations.automation[businessType],
          innovation: recommendations.innovation[businessType]
        },
        buffettPrinciples: {
          valueInvesting: {
            title: buffettPrinciples.valueInvesting.title,
            description: buffettPrinciples.valueInvesting.description,
            application: buffettPrinciples.valueInvesting.application[businessType]
          },
          longTermFocus: {
            title: buffettPrinciples.longTermFocus.title,
            description: buffettPrinciples.longTermFocus.description,
            application: buffettPrinciples.longTermFocus.application[businessType]
          },
          qualityOverQuantity: {
            title: buffettPrinciples.qualityOverQuantity.title,
            description: buffettPrinciples.qualityOverQuantity.description,
            application: buffettPrinciples.qualityOverQuantity.application[businessType]
          }
        },
        milestones: milestonesByStage[stage],
        aiInsight,
        isHumanitarian,
        capitalRequired
      }
    });
  } catch (error) {
    console.error('Error generating business recommendations:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Export the serverless function
module.exports.handler = serverless(app);
