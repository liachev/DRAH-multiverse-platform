const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const propertyApi = require('../functions/propertyApi');
const auctionApi = require('../functions/auctionApi');
const financeApi = require('../functions/financeApi');
const constructionApi = require('../functions/constructionApi');
const businessApi = require('../functions/businessApi');

let mongoServer;
let app;

// Setup in-memory MongoDB server for testing
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Set environment variable for database connection
  process.env.MONGODB_URI = uri;
  
  // Create Express app for testing
  app = express();
  
  // Mount API handlers
  app.use('/.netlify/functions/propertyApi', propertyApi.handler);
  app.use('/.netlify/functions/auctionApi', auctionApi.handler);
  app.use('/.netlify/functions/financeApi', financeApi.handler);
  app.use('/.netlify/functions/constructionApi', constructionApi.handler);
  app.use('/.netlify/functions/businessApi', businessApi.handler);
});

// Clean up after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('API Integration Tests', () => {
  // Test Property API
  describe('Property API', () => {
    it('should create and retrieve a property', async () => {
      // Create a property
      const propertyData = {
        title: 'API Test Property',
        description: 'Property created through API test',
        price: 275000,
        location: {
          address: '123 API Test St',
          city: 'API City',
          state: 'AT',
          zipCode: '12345',
          coordinates: [0, 0]
        },
        propertyType: 'house',
        environment: 'real_world',
        bedrooms: 3,
        bathrooms: 2,
        size: 1800,
        sizeUnit: 'sqft',
        isDRAH: true,
        status: 'available'
      };
      
      // Create property
      const createResponse = await request(app)
        .post('/.netlify/functions/propertyApi/api/properties')
        .send(propertyData)
        .expect(201);
      
      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.data._id).toBeDefined();
      
      const propertyId = createResponse.body.data._id;
      
      // Retrieve property
      const getResponse = await request(app)
        .get(`/.netlify/functions/propertyApi/api/properties/${propertyId}`)
        .expect(200);
      
      expect(getResponse.body.success).toBe(true);
      expect(getResponse.body.data.title).toBe(propertyData.title);
      expect(getResponse.body.data.price).toBe(propertyData.price);
    });
    
    it('should filter properties by DRAH status', async () => {
      // Create a non-DRAH property
      const nonDrahProperty = {
        title: 'Non-DRAH Property',
        description: 'Regular property',
        price: 300000,
        location: {
          address: '456 Regular St',
          city: 'Regular City',
          state: 'RC',
          zipCode: '54321',
          coordinates: [0, 0]
        },
        propertyType: 'house',
        environment: 'real_world',
        bedrooms: 4,
        bathrooms: 3,
        size: 2200,
        sizeUnit: 'sqft',
        isDRAH: false,
        status: 'available'
      };
      
      await request(app)
        .post('/.netlify/functions/propertyApi/api/properties')
        .send(nonDrahProperty)
        .expect(201);
      
      // Filter properties by DRAH status
      const filterResponse = await request(app)
        .get('/.netlify/functions/propertyApi/api/properties?isDRAH=true')
        .expect(200);
      
      expect(filterResponse.body.success).toBe(true);
      expect(filterResponse.body.data.length).toBeGreaterThan(0);
      
      // Verify all returned properties are DRAH
      filterResponse.body.data.forEach(property => {
        expect(property.isDRAH).toBe(true);
      });
    });
  });
  
  // Test Finance API
  describe('Finance API', () => {
    it('should calculate mortgage payment', async () => {
      const calculationData = {
        loanAmount: 250000,
        interestRate: 4.5,
        loanTerm: 30,
        ficoScore: 650
      };
      
      const response = await request(app)
        .post('/.netlify/functions/financeApi/api/finance/calculate')
        .send(calculationData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.monthlyPayment).toBeGreaterThan(0);
      expect(response.body.data.isDRAHEligible).toBe(true);
      expect(response.body.data.downPayment).toBe(0); // No down payment for DRAH Finance
      expect(response.body.data.pmi).toBe(0); // No PMI for DRAH Finance
    });
    
    it('should identify ineligible FICO scores', async () => {
      const calculationData = {
        loanAmount: 250000,
        interestRate: 4.5,
        loanTerm: 30,
        ficoScore: 480 // Below minimum 500
      };
      
      const response = await request(app)
        .post('/.netlify/functions/financeApi/api/finance/calculate')
        .send(calculationData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.isDRAHEligible).toBe(false);
    });
  });
  
  // Test Construction API
  describe('Construction API', () => {
    it('should calculate construction costs with 10% savings', async () => {
      const constructionData = {
        packageType: 'standard',
        squareFootage: 1800,
        features: {
          garage: true,
          porch: false,
          smartHome: false
        },
        bedrooms: 3,
        bathrooms: 2,
        stories: 1
      };
      
      const response = await request(app)
        .post('/.netlify/functions/constructionApi/api/construction/calculate')
        .send(constructionData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      
      // Base price should be 1800 * 175 = 315000
      expect(response.body.data.basePrice).toBe(315000);
      
      // Additional cost should be 25000 for garage
      expect(response.body.data.additionalCost).toBe(25000);
      
      // Market price should be 340000
      expect(response.body.data.marketPrice).toBe(340000);
      
      // Total price should be 10% less than market price
      expect(response.body.data.totalPrice).toBe(306000);
      
      // Savings should be 34000
      expect(response.body.data.savings).toBe(34000);
    });
  });
  
  // Test Business API
  describe('Business API', () => {
    it('should generate business recommendations', async () => {
      const businessData = {
        businessType: 'micro_saas',
        stage: 'ideation',
        capitalRequired: 5000,
        isHumanitarian: false
      };
      
      const response = await request(app)
        .post('/.netlify/functions/businessApi/api/business/recommendations')
        .send(businessData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.businessType).toBeDefined();
      expect(response.body.data.recommendations).toBeDefined();
      expect(response.body.data.buffettPrinciples).toBeDefined();
      expect(response.body.data.milestones).toBeDefined();
      expect(response.body.data.milestones.length).toBe(4); // 4 milestones for ideation stage
    });
    
    it('should handle humanitarian business focus', async () => {
      const businessData = {
        businessType: 'sustainable_marketplace',
        stage: 'validation',
        capitalRequired: 8000,
        isHumanitarian: true
      };
      
      const response = await request(app)
        .post('/.netlify/functions/businessApi/api/business/recommendations')
        .send(businessData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.isHumanitarian).toBe(true);
      expect(response.body.data.aiInsight).toContain('humanitarian');
    });
  });
});
