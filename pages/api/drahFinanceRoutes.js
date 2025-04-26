const express = require('express');
const router = express.Router();
const DRAHFinance = require('../../models/DRAHFinance');
const Property = require('../../models/Property');
const User = require('../../models/User');

// Get DRAH Finance information and options
router.get('/information', async (req, res) => {
  try {
    // This would be expanded with actual finance information from a database
    const financeInfo = {
      name: 'DRAH Finance',
      description: 'Alternative mortgage solutions for lot buyers with flexible requirements',
      minimumRequirements: {
        ficoScore: 500,
        pmi: 'None required',
        downPayment: 'No down payment required'
      },
      loanOptions: [
        {
          name: 'Standard DRAH Mortgage',
          description: 'Basic mortgage option for DRAH properties',
          interestRateRange: '3.5% - 5.5%',
          terms: [15, 20, 30],
          features: [
            'No PMI required',
            'No down payment required',
            'Minimum FICO score of 500',
            'Fixed interest rates'
          ]
        },
        {
          name: 'DRAH Construction-to-Permanent Loan',
          description: 'Combined loan for lot purchase and home construction',
          interestRateRange: '4.0% - 6.0%',
          terms: [15, 20, 30],
          features: [
            'Single loan for both land purchase and construction',
            'No PMI required',
            'No down payment required',
            'Minimum FICO score of 500',
            'Converts to permanent mortgage after construction'
          ]
        },
        {
          name: 'DRAH Rehabilitation Loan',
          description: 'Loan for purchasing and rehabilitating existing properties',
          interestRateRange: '3.75% - 5.75%',
          terms: [15, 20, 30],
          features: [
            'Finances both purchase and rehabilitation costs',
            'No PMI required',
            'No down payment required',
            'Minimum FICO score of 500',
            'Rehabilitation funds held in escrow'
          ]
        }
      ],
      process: [
        {
          step: 1,
          name: 'Pre-Qualification',
          description: 'Check eligibility and get pre-qualified for a loan amount'
        },
        {
          step: 2,
          name: 'Application',
          description: 'Complete full mortgage application with required documentation'
        },
        {
          step: 3,
          name: 'Underwriting',
          description: 'Loan undergoes review and approval process'
        },
        {
          step: 4,
          name: 'Closing',
          description: 'Sign final paperwork and complete the loan process'
        }
      ],
      requiredDocuments: [
        {
          name: 'Identification',
          description: 'Government-issued ID (driver\'s license, passport, etc.)'
        },
        {
          name: 'Income Verification',
          description: 'Recent pay stubs, W-2s, or tax returns'
        },
        {
          name: 'Employment Verification',
          description: 'Proof of employment and employment history'
        },
        {
          name: 'Credit Report',
          description: 'Authorization to pull credit report'
        },
        {
          name: 'Bank Statements',
          description: 'Recent bank statements showing financial history'
        }
      ],
      contactInformation: {
        phone: '(555) 123-4567',
        email: 'finance@drah.com',
        website: 'https://drah.com/finance'
      },
      testimonials: [
        {
          name: "Michael R.",
          location: "St. Bernard Parish",
          quote: "With a FICO score of just 520, I never thought I'd be able to buy a home. DRAH Finance made it possible with no down payment and no PMI.",
          rating: 5
        },
        {
          name: "Sarah L.",
          location: "Chalmette",
          quote: "The construction-to-permanent loan was perfect for us. We bought our lot and built our dream home with a single loan process.",
          rating: 5
        },
        {
          name: "David T.",
          location: "Meraux",
          quote: "After a natural disaster destroyed our home, DRAH Finance helped us rebuild with their rehabilitation loan. The process was simple and fast.",
          rating: 4
        }
      ]
    };
    
    res.json(financeInfo);
  } catch (err) {
    console.error('Error getting DRAH Finance information:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Check eligibility for DRAH Finance
router.post('/check-eligibility', async (req, res) => {
  try {
    const { ficoScore, annualIncome, loanAmount, propertyId } = req.body;
    
    if (!ficoScore || !annualIncome || !loanAmount) {
      return res.status(400).json({ error: true, message: 'FICO score, annual income, and loan amount are required' });
    }
    
    // Check if property exists if propertyId is provided
    if (propertyId) {
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ error: true, message: 'Property not found' });
      }
    }
    
    // Check eligibility using the static method from the model
    const eligibility = DRAHFinance.checkEligibility(ficoScore, annualIncome, loanAmount);
    
    // If eligible, calculate estimated monthly payment
    if (eligibility.eligible) {
      // Create a temporary DRAHFinance object to calculate payment
      const tempFinance = new DRAHFinance({
        userId: '000000000000000000000000', // Placeholder
        propertyId: propertyId || '000000000000000000000000', // Placeholder
        ficoScore,
        loanAmount,
        interestRate: ficoScore < 600 ? 5.5 : ficoScore < 650 ? 4.5 : 3.5, // Simple rate determination
        loanTerm: 30, // Default to 30 years
        monthlyPayment: 0 // Will be calculated
      });
      
      // Calculate monthly payment
      tempFinance.monthlyPayment = tempFinance.calculateMonthlyPayment();
      
      // Add payment information to response
      eligibility.paymentEstimate = {
        monthlyPayment: tempFinance.monthlyPayment,
        interestRate: tempFinance.interestRate,
        loanTerm: tempFinance.loanTerm,
        totalPayment: tempFinance.monthlyPayment * tempFinance.loanTerm * 12
      };
    }
    
    res.json(eligibility);
  } catch (err) {
    console.error('Error checking eligibility:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Submit pre-qualification application
router.post('/pre-qualify', async (req, res) => {
  try {
    const { 
      userId, 
      propertyId, 
      ficoScore, 
      loanAmount,
      loanTerm = 30,
      income,
      employmentInfo
    } = req.body;
    
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    // Validate property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }
    
    // Check eligibility
    const eligibility = DRAHFinance.checkEligibility(ficoScore, income.annual, loanAmount);
    
    if (!eligibility.eligible) {
      return res.status(400).json({ 
        error: true, 
        message: 'Not eligible for DRAH Finance',
        reason: eligibility.reason
      });
    }
    
    // Determine interest rate based on FICO score
    let interestRate;
    if (ficoScore >= 700) {
      interestRate = 3.5;
    } else if (ficoScore >= 650) {
      interestRate = 4.0;
    } else if (ficoScore >= 600) {
      interestRate = 4.5;
    } else if (ficoScore >= 550) {
      interestRate = 5.0;
    } else {
      interestRate = 5.5;
    }
    
    // Create new finance application
    const newFinance = new DRAHFinance({
      userId,
      propertyId,
      ficoScore,
      loanAmount,
      interestRate,
      loanTerm,
      income: {
        annual: income.annual,
        source: income.source,
        verification: 'not_verified'
      },
      employment: {
        employer: employmentInfo.employer,
        position: employmentInfo.position,
        yearsEmployed: employmentInfo.yearsEmployed,
        verification: 'not_verified'
      },
      applicationStatus: 'pre_qualification'
    });
    
    // Calculate monthly payment
    newFinance.monthlyPayment = newFinance.calculateMonthlyPayment();
    
    const savedFinance = await newFinance.save();
    
    res.status(201).json({
      message: 'Pre-qualification application submitted successfully',
      application: savedFinance,
      nextSteps: [
        'Submit required documentation',
        'Complete full application',
        'Await underwriting decision'
      ]
    });
  } catch (err) {
    console.error('Error submitting pre-qualification:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Submit full application
router.post('/apply', async (req, res) => {
  try {
    const { financeId, additionalDocuments = [] } = req.body;
    
    // Find the pre-qualification application
    const finance = await DRAHFinance.findById(financeId);
    
    if (!finance) {
      return res.status(404).json({ error: true, message: 'Finance application not found' });
    }
    
    // Validate application is in pre-qualification status
    if (finance.applicationStatus !== 'pre_qualification') {
      return res.status(400).json({ 
        error: true, 
        message: `Application is already in ${finance.applicationStatus} status` 
      });
    }
    
    // Update application status
    finance.applicationStatus = 'application_submitted';
    
    // Add documents
    finance.documents = additionalDocuments.map(doc => ({
      name: doc.name,
      type: doc.type,
      url: doc.url,
      uploadDate: new Date(),
      status: 'pending'
    }));
    
    const updatedFinance = await finance.save();
    
    res.json({
      message: 'Full application submitted successfully',
      application: updatedFinance,
      nextSteps: [
        'Application will be reviewed by underwriting team',
        'You may be contacted for additional information',
        'Decision typically provided within 5-7 business days'
      ]
    });
  } catch (err) {
    console.error('Error submitting full application:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get user's finance applications
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    
    // Build filter
    const filter = { userId };
    
    if (status) {
      filter.applicationStatus = status;
    }
    
    const applications = await DRAHFinance.find(filter)
      .populate('propertyId')
      .sort({ applicationDate: -1 });
    
    res.json(applications);
  } catch (err) {
    console.error('Error getting user finance applications:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get finance application details
router.get('/:financeId', async (req, res) => {
  try {
    const { financeId } = req.params;
    
    const finance = await DRAHFinance.findById(financeId)
      .populate('userId', 'username email firstName lastName')
      .populate('propertyId');
    
    if (!finance) {
      return res.status(404).json({ error: true, message: 'Finance application not found' });
    }
    
    res.json(finance);
  } catch (err) {
    console.error('Error getting finance application details:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Update application status (admin only)
router.put('/:financeId/status', async (req, res) => {
  try {
    const { financeId } = req.params;
    const { status, notes } = req.body;
    
    const finance = await DRAHFinance.findById(financeId);
    
    if (!finance) {
      return res.status(404).json({ error: true, message: 'Finance application not found' });
    }
    
    // Validate status transition
    const validTransitions = {
      'pre_qualification': ['application_submitted', 'denied'],
      'application_submitted': ['under_review', 'denied'],
      'under_review': ['approved', 'denied'],
      'approved': ['closed', 'denied'],
      'denied': [],
      'closed': []
    };
    
    if (!validTransitions[finance.applicationStatus].includes(status)) {
      return res.status(400).json({ 
        error: true, 
        message: `Invalid status transition from ${finance.applicationStatus} to ${status}`,
        validTransitions: validTransitions[finance.applicationStatus]
      });
    }
    
    // Update status
    finance.applicationStatus = status;
    
    // Add notes if provided
    if (notes) {
      finance.additionalNotes = finance.additionalNotes 
        ? `${finance.additionalNotes}\n\n${new Date().toISOString()}: ${notes}`
        : `${new Date().toISOString()}: ${notes}`;
    }
    
    // Update relevant dates based on status
    if (status === 'approved') {
      finance.approvalDate = new Date();
    } else if (status === 'closed') {
      finance.closingDate = new Date();
    }
    
    const updatedFinance = await finance.save();
    
    res.json({
      message: 'Finance application status updated successfully',
      application: updatedFinance
    });
  } catch (err) {
    console.error('Error updating finance application status:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Calculate mortgage payment
router.post('/calculate-payment', async (req, res) => {
  try {
    const { loanAmount, interestRate, loanTerm } = req.body;
    
    if (!loanAmount || !interestRate || !loanTerm) {
      return res.status(400).json({ error: true, message: 'Loan amount, interest rate, and loan term are required' });
    }
    
    // Create a temporary DRAHFinance object to calculate payment
    const tempFinance = new DRAHFinance({
      userId: '000000000000000000000000', // Placeholder
      propertyId: '000000000000000000000000', // Placeholder
      ficoScore: 700, // Placeholder
      loanAmount,
      interestRate,
      loanTerm,
      monthlyPayment: 0 // Will be calculated
    });
    
    // Calculate monthly payment
    tempFinance.monthlyPayment = tempFinance.calculateMonthlyPayment();
    
    // Calculate additional information
    const totalPayment = tempFinance.monthlyPayment * loanTerm * 12;
    const totalInterest = totalPayment - loanAmount;
    
    res.json({
      monthlyPayment: tempFinance.monthlyPayment,
      totalPayment,
      totalInterest,
      loanAmount,
      interestRate,
      loanTerm,
      paymentBreakdown: {
        principalAndInterest: tempFinance.monthlyPayment,
        taxes: 0, // Would be calculated based on property value and location
        insurance: 0, // Would be calculated based on property value and location
        pmi: 0 // No PMI with DRAH Finance
      }
    });
  } catch (err) {
    console.error('Error calculating mortgage payment:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// Get finance statistics
router.get('/statistics/summary', async (req, res) => {
  try {
    // Get counts by status
    const statusCounts = await DRAHFinance.aggregate([
      { $group: { _id: '$applicationStatus', count: { $sum: 1 } } }
    ]);
    
    // Format status counts
    const statusStats = {
      total: 0,
      pre_qualification: 0,
      application_submitted: 0,
      under_review: 0,
      approved: 0,
      denied: 0,
      closed: 0
    };
    
    statusCounts.forEach(item => {
      statusStats[item._id] = item.count;
      statusStats.total += item.count;
    });
    
    // Get average loan amount and interest rate
    const loanStats = await DRAHFinance.aggregate([
      { $group: { 
        _id: null, 
        averageLo
(Content truncated due to size limit. Use line ranges to read in chunks)