const express = require('express');
const router = express.Router();
const FinanceApplication = require('../models/FinanceApplication');

// GET all finance applications
router.get('/', async (req, res) => {
  try {
    const applications = await FinanceApplication.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET finance application by ID
router.get('/:id', async (req, res) => {
  try {
    const application = await FinanceApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Finance application not found' });
    }
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new finance application
router.post('/', async (req, res) => {
  try {
    const application = new FinanceApplication(req.body);
    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update finance application
router.put('/:id', async (req, res) => {
  try {
    const updatedApplication = await FinanceApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedApplication) {
      return res.status(404).json({ message: 'Finance application not found' });
    }
    
    res.json(updatedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE finance application
router.delete('/:id', async (req, res) => {
  try {
    const deletedApplication = await FinanceApplication.findByIdAndDelete(req.params.id);
    
    if (!deletedApplication) {
      return res.status(404).json({ message: 'Finance application not found' });
    }
    
    res.json({ message: 'Finance application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST calculate mortgage
router.post('/calculate', async (req, res) => {
  try {
    const { propertyPrice, interestRate, loanTerm, ficoScore } = req.body;
    
    if (!propertyPrice || !interestRate || !loanTerm) {
      return res.status(400).json({ message: 'Property price, interest rate, and loan term are required' });
    }
    
    // Check FICO score eligibility (minimum 500)
    if (ficoScore && ficoScore < 500) {
      return res.status(400).json({ 
        message: 'FICO score below minimum requirement of 500',
        eligible: false
      });
    }
    
    // Calculate monthly payment
    // Formula: M = P[r(1+r)^n]/[(1+r)^n-1]
    // Where:
    // M = monthly payment
    // P = loan principal (property price for DRAH since no down payment)
    // r = monthly interest rate (annual rate / 12)
    // n = number of payments (loan term in years * 12)
    
    const principal = propertyPrice;
    const monthlyRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    // Calculate total payment and interest
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    
    res.json({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      loanAmount: principal.toFixed(2),
      downPayment: 0, // No down payment for DRAH
      pmi: 0, // No PMI for DRAH
      eligible: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST check DRAH eligibility
router.post('/check-eligibility', async (req, res) => {
  try {
    const { ficoScore, propertyId } = req.body;
    
    if (!ficoScore) {
      return res.status(400).json({ message: 'FICO score is required' });
    }
    
    // Check FICO score eligibility (minimum 500)
    const eligible = ficoScore >= 500;
    
    res.json({
      eligible,
      minimumFicoScore: 500,
      requiresDownPayment: false,
      requiresPMI: false,
      message: eligible 
        ? 'You are eligible for DRAH financing with no down payment and no PMI' 
        : 'FICO score below minimum requirement of 500'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user applications
router.get('/user/:userId', async (req, res) => {
  try {
    const applications = await FinanceApplication.find({ 'applicant._id': req.params.userId });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
