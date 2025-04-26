const express = require('express');
const router = express.Router();
const BusinessModel = require('../models/BusinessModel');

// GET all business models
router.get('/', async (req, res) => {
  try {
    const businessModels = await BusinessModel.find();
    res.json(businessModels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET business model by ID
router.get('/:id', async (req, res) => {
  try {
    const businessModel = await BusinessModel.findById(req.params.id);
    
    if (!businessModel) {
      return res.status(404).json({ message: 'Business model not found' });
    }
    
    res.json(businessModel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new business model
router.post('/', async (req, res) => {
  try {
    const businessModel = new BusinessModel(req.body);
    const savedBusinessModel = await businessModel.save();
    res.status(201).json(savedBusinessModel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update business model
router.put('/:id', async (req, res) => {
  try {
    const updatedBusinessModel = await BusinessModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedBusinessModel) {
      return res.status(404).json({ message: 'Business model not found' });
    }
    
    res.json(updatedBusinessModel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE business model
router.delete('/:id', async (req, res) => {
  try {
    const deletedBusinessModel = await BusinessModel.findByIdAndDelete(req.params.id);
    
    if (!deletedBusinessModel) {
      return res.status(404).json({ message: 'Business model not found' });
    }
    
    res.json({ message: 'Business model deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST generate business model
router.post('/generate', async (req, res) => {
  try {
    const { 
      businessType, 
      initialCapital, 
      targetMarket, 
      humanitarianFocus,
      scalability
    } = req.body;
    
    if (!businessType) {
      return res.status(400).json({ message: 'Business type is required' });
    }
    
    // Generate business model based on Warren Buffett principles
    const buffettPrinciples = [
      "Invest in businesses with strong economic moats",
      "Focus on long-term value rather than short-term profits",
      "Invest in businesses you understand",
      "Look for businesses with consistent operating history",
      "Choose businesses with favorable long-term prospects",
      "Select businesses with honest and competent management",
      "Only invest at attractive prices with margin of safety"
    ];
    
    // Business model templates based on business type
    let businessModelTemplate = {};
    
    switch (businessType) {
      case 'retail':
        businessModelTemplate = {
          revenueStreams: ['Product sales', 'Value-added services', 'Membership fees'],
          costStructure: ['Inventory', 'Rent', 'Staff', 'Marketing'],
          keyMetrics: ['Sales per square foot', 'Inventory turnover', 'Customer acquisition cost'],
          scalabilityFactors: ['E-commerce integration', 'Supply chain optimization', 'Brand development']
        };
        break;
      case 'saas':
        businessModelTemplate = {
          revenueStreams: ['Subscription fees', 'Premium features', 'API access'],
          costStructure: ['Development', 'Hosting', 'Customer support', 'Marketing'],
          keyMetrics: ['Monthly recurring revenue', 'Customer lifetime value', 'Churn rate'],
          scalabilityFactors: ['Product automation', 'Self-service onboarding', 'Viral growth loops']
        };
        break;
      case 'manufacturing':
        businessModelTemplate = {
          revenueStreams: ['Product sales', 'Maintenance contracts', 'Licensing'],
          costStructure: ['Raw materials', 'Equipment', 'Labor', 'Facilities'],
          keyMetrics: ['Production efficiency', 'Defect rate', 'Inventory turnover'],
          scalabilityFactors: ['Process automation', 'Supply chain integration', 'Product standardization']
        };
        break;
      case 'service':
        businessModelTemplate = {
          revenueStreams: ['Service fees', 'Retainer contracts', 'Upselling'],
          costStructure: ['Staff', 'Training', 'Facilities', 'Marketing'],
          keyMetrics: ['Utilization rate', 'Customer satisfaction', 'Repeat business'],
          scalabilityFactors: ['Process standardization', 'Team expansion', 'Geographic expansion']
        };
        break;
      case 'nonprofit':
        businessModelTemplate = {
          revenueStreams: ['Donations', 'Grants', 'Service fees', 'Sponsorships'],
          costStructure: ['Program delivery', 'Fundraising', 'Administration', 'Marketing'],
          keyMetrics: ['Program impact', 'Donor retention', 'Overhead ratio'],
          scalabilityFactors: ['Volunteer engagement', 'Partnership development', 'Digital outreach']
        };
        break;
      default:
        businessModelTemplate = {
          revenueStreams: ['Primary product/service', 'Secondary offerings', 'Recurring revenue'],
          costStructure: ['Fixed costs', 'Variable costs', 'Marketing', 'Operations'],
          keyMetrics: ['Revenue growth', 'Profit margin', 'Customer retention'],
          scalabilityFactors: ['Process optimization', 'Team development', 'Market expansion']
        };
    }
    
    // Adjust for initial capital
    let capitalStrategy = '';
    if (initialCapital < 10000) {
      capitalStrategy = 'Bootstrap with minimal overhead, focus on quick revenue generation, and reinvest profits';
    } else if (initialCapital < 50000) {
      capitalStrategy = 'Allocate capital to essential infrastructure, prioritize customer acquisition, and establish operational efficiency';
    } else if (initialCapital < 250000) {
      capitalStrategy = 'Invest in key talent, build robust systems, and develop market presence while maintaining capital reserves';
    } else {
      capitalStrategy = 'Scale strategically with significant market penetration, build comprehensive infrastructure, and position for long-term market leadership';
    }
    
    // Adjust for humanitarian focus
    let humanitarianStrategy = [];
    if (humanitarianFocus) {
      humanitarianStrategy = [
        'Integrate social impact metrics into business KPIs',
        'Develop partnerships with relevant NGOs and community organizations',
        'Allocate percentage of profits to mission-aligned causes',
        'Design products/services with accessibility and inclusivity in mind',
        'Create employment opportunities for underserved communities'
      ];
    }
    
    // Generate recommendations based on Buffett principles
    const recommendations = buffettPrinciples.map(principle => {
      return {
        principle,
        application: generateApplicationForPrinciple(principle, businessType, initialCapital, humanitarianFocus)
      };
    });
    
    // Create final business model
    const generatedBusinessModel = {
      businessType,
      initialCapital,
      targetMarket,
      humanitarianFocus,
      scalability,
      buffettPrinciples: recommendations,
      businessModelTemplate,
      capitalStrategy,
      humanitarianStrategy,
      timestamp: new Date()
    };
    
    res.json(generatedBusinessModel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to generate principle applications
function generateApplicationForPrinciple(principle, businessType, initialCapital, humanitarianFocus) {
  // This would be more sophisticated in a real implementation
  // Here we're providing simplified examples
  
  switch (principle) {
    case "Invest in businesses with strong economic moats":
      return `Identify and develop unique advantages in your ${businessType} business that competitors cannot easily replicate, such as proprietary technology, strong brand recognition, or exclusive partnerships.`;
    
    case "Focus on long-term value rather than short-term profits":
      return `Prioritize building sustainable ${businessType} operations and customer relationships over quick wins. Invest in quality and reputation even if it means higher initial costs.`;
    
    case "Invest in businesses you understand":
      return `Leverage your expertise in the ${businessType} sector. If there are aspects you don't understand, invest in education or bring in partners with complementary knowledge.`;
    
    case "Look for businesses with consistent operating history":
      return `Study successful ${businessType} models and adopt proven operational practices while innovating where you can add unique value.`;
    
    case "Choose businesses with favorable long-term prospects":
      return `Analyze market trends to ensure ${businessType} businesses have growing demand and aren't at risk of technological obsolescence or market saturation.`;
    
    case "Select businesses with honest and competent management":
      return `Build a team with integrity and relevant ${businessType} experience. Establish clear values and ethical guidelines from the start.`;
    
    case "Only invest at attractive prices with margin of safety":
      return `Start with a lean approach, especially with initial capital of $${initialCapital}. Focus on high-margin offerings and maintain cash reserves for unexpected challenges.`;
    
    default:
      return `Apply this principle by adapting it to your specific ${businessType} context and scale.`;
  }
}

// GET user business models
router.get('/user/:userId', async (req, res) => {
  try {
    const businessModels = await BusinessModel.find({ 'creator._id': req.params.userId });
    res.json(businessModels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
