const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Property = require('../models/Property');
const Auction = require('../models/Auction');
const User = require('../models/User');
const FinanceApplication = require('../models/FinanceApplication');
const ConstructionService = require('../models/ConstructionService');
const BusinessModel = require('../models/BusinessModel');

let mongoServer;

// Setup in-memory MongoDB server for testing
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Clean up after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests
afterEach(async () => {
  await Property.deleteMany({});
  await Auction.deleteMany({});
  await User.deleteMany({});
  await FinanceApplication.deleteMany({});
  await ConstructionService.deleteMany({});
  await BusinessModel.deleteMany({});
});

describe('MongoDB Models Tests', () => {
  // Test User model
  describe('User Model', () => {
    it('should create a new user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        ficoScore: 720,
        role: 'user'
      };
      
      const user = new User(userData);
      const savedUser = await user.save();
      
      expect(savedUser._id).toBeDefined();
      expect(savedUser.firstName).toBe(userData.firstName);
      expect(savedUser.lastName).toBe(userData.lastName);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.ficoScore).toBe(userData.ficoScore);
    });
    
    it('should fail to create user without required fields', async () => {
      const user = new User({
        firstName: 'John'
      });
      
      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
      expect(error.errors.lastName).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });
  });
  
  // Test Property model
  describe('Property Model', () => {
    it('should create a new property', async () => {
      const propertyData = {
        title: 'Test Property',
        description: 'This is a test property',
        price: 250000,
        location: {
          address: '123 Test St',
          city: 'Test City',
          state: 'TS',
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
      
      const property = new Property(propertyData);
      const savedProperty = await property.save();
      
      expect(savedProperty._id).toBeDefined();
      expect(savedProperty.title).toBe(propertyData.title);
      expect(savedProperty.price).toBe(propertyData.price);
      expect(savedProperty.isDRAH).toBe(propertyData.isDRAH);
    });
    
    it('should create a metaverse property', async () => {
      const propertyData = {
        title: 'Metaverse Land',
        description: 'Virtual land in the metaverse',
        price: 5000,
        metaverseLocation: {
          platform: 'Decentraland',
          district: 'Fashion District',
          coordinates: 'X: 10, Y: 20',
          url: 'https://play.decentraland.org/?position=10,20'
        },
        propertyType: 'metaverse_land',
        environment: 'metaverse',
        size: 16,
        sizeUnit: 'parcels',
        isDRAH: false,
        status: 'available'
      };
      
      const property = new Property(propertyData);
      const savedProperty = await property.save();
      
      expect(savedProperty._id).toBeDefined();
      expect(savedProperty.title).toBe(propertyData.title);
      expect(savedProperty.environment).toBe('metaverse');
      expect(savedProperty.metaverseLocation.platform).toBe('Decentraland');
    });
  });
  
  // Test Auction model
  describe('Auction Model', () => {
    it('should create a new auction', async () => {
      // Create a property first
      const property = new Property({
        title: 'Auction Property',
        description: 'Property for auction',
        price: 200000,
        location: {
          address: '456 Auction St',
          city: 'Auction City',
          state: 'AC',
          zipCode: '54321',
          coordinates: [0, 0]
        },
        propertyType: 'vacant_lot',
        environment: 'real_world',
        size: 5000,
        sizeUnit: 'sqft',
        isDRAH: true,
        status: 'auction'
      });
      
      const savedProperty = await property.save();
      
      const auctionData = {
        property: savedProperty._id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        startingBid: 150000,
        currentBid: 0,
        depositAmount: 850,
        status: 'upcoming',
        isDRAH: true
      };
      
      const auction = new Auction(auctionData);
      const savedAuction = await auction.save();
      
      expect(savedAuction._id).toBeDefined();
      expect(savedAuction.property.toString()).toBe(savedProperty._id.toString());
      expect(savedAuction.startingBid).toBe(auctionData.startingBid);
      expect(savedAuction.status).toBe('upcoming');
    });
    
    it('should add a deposit to an auction', async () => {
      // Create a user
      const user = new User({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        ficoScore: 680,
        role: 'user'
      });
      
      const savedUser = await user.save();
      
      // Create a property
      const property = new Property({
        title: 'Deposit Property',
        description: 'Property for deposit test',
        price: 180000,
        location: {
          address: '789 Deposit St',
          city: 'Deposit City',
          state: 'DC',
          zipCode: '67890',
          coordinates: [0, 0]
        },
        propertyType: 'house',
        environment: 'real_world',
        size: 1500,
        sizeUnit: 'sqft',
        isDRAH: true,
        status: 'auction'
      });
      
      const savedProperty = await property.save();
      
      // Create an auction
      const auction = new Auction({
        property: savedProperty._id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        startingBid: 150000,
        currentBid: 0,
        depositAmount: 850,
        status: 'upcoming',
        isDRAH: true
      });
      
      const savedAuction = await auction.save();
      
      // Add deposit
      savedAuction.deposits.push({
        user: savedUser._id,
        amount: 850,
        timestamp: new Date(),
        status: 'confirmed',
        transactionId: 'test-transaction-123'
      });
      
      await savedAuction.save();
      
      const updatedAuction = await Auction.findById(savedAuction._id);
      
      expect(updatedAuction.deposits.length).toBe(1);
      expect(updatedAuction.deposits[0].user.toString()).toBe(savedUser._id.toString());
      expect(updatedAuction.deposits[0].amount).toBe(850);
      expect(updatedAuction.deposits[0].status).toBe('confirmed');
    });
  });
  
  // Test FinanceApplication model
  describe('FinanceApplication Model', () => {
    it('should create a new finance application', async () => {
      // Create a user
      const user = new User({
        firstName: 'Robert',
        lastName: 'Johnson',
        email: 'robert.johnson@example.com',
        password: 'password123',
        ficoScore: 620,
        role: 'user'
      });
      
      const savedUser = await user.save();
      
      // Create a property
      const property = new Property({
        title: 'Finance Property',
        description: 'Property for finance test',
        price: 220000,
        location: {
          address: '101 Finance St',
          city: 'Finance City',
          state: 'FC',
          zipCode: '13579',
          coordinates: [0, 0]
        },
        propertyType: 'house',
        environment: 'real_world',
        size: 1700,
        sizeUnit: 'sqft',
        isDRAH: true,
        status: 'available'
      });
      
      const savedProperty = await property.save();
      
      // Create finance application
      const applicationData = {
        applicant: savedUser._id,
        property: savedProperty._id,
        loanAmount: 220000,
        loanTerm: 30,
        interestRate: 4.5,
        ficoScore: savedUser.ficoScore,
        loanType: 'standard_mortgage',
        hasPMI: false,
        downPayment: 0,
        status: 'submitted'
      };
      
      const application = new FinanceApplication(applicationData);
      const savedApplication = await application.save();
      
      expect(savedApplication._id).toBeDefined();
      expect(savedApplication.applicant.toString()).toBe(savedUser._id.toString());
      expect(savedApplication.property.toString()).toBe(savedProperty._id.toString());
      expect(savedApplication.loanAmount).toBe(applicationData.loanAmount);
      expect(savedApplication.hasPMI).toBe(false); // No PMI for DRAH Finance
      expect(savedApplication.downPayment).toBe(0); // No down payment for DRAH Finance
    });
  });
  
  // Test ConstructionService model
  describe('ConstructionService Model', () => {
    it('should create a new construction service request', async () => {
      // Create a user
      const user = new User({
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@example.com',
        password: 'password123',
        ficoScore: 700,
        role: 'user'
      });
      
      const savedUser = await user.save();
      
      // Create a property
      const property = new Property({
        title: 'Construction Property',
        description: 'Property for construction test',
        price: 50000,
        location: {
          address: '202 Construction St',
          city: 'Construction City',
          state: 'CC',
          zipCode: '24680',
          coordinates: [0, 0]
        },
        propertyType: 'vacant_lot',
        environment: 'real_world',
        size: 8000,
        sizeUnit: 'sqft',
        isDRAH: true,
        status: 'available'
      });
      
      const savedProperty = await property.save();
      
      // Create construction service request
      const serviceData = {
        client: savedUser._id,
        property: savedProperty._id,
        packageType: 'standard',
        squareFootage: 1800,
        bedrooms: 3,
        bathrooms: 2,
        stories: 1,
        features: {
          garage: true,
          porch: false,
          energyEfficient: true,
          hurricaneResistant: true,
          smartHome: false
        },
        basePrice: 315000, // 1800 * 175
        additionalCost: 25000, // Garage
        marketPrice: 340000,
        totalPrice: 306000, // 10% discount
        savings: 34000,
        status: 'submitted'
      };
      
      const service = new ConstructionService(serviceData);
      const savedService = await service.save();
      
      expect(savedService._id).toBeDefined();
      expect(savedService.client.toString()).toBe(savedUser._id.toString());
      expect(savedService.property.toString()).toBe(savedProperty._id.toString());
      expect(savedService.packageType).toBe(serviceData.packageType);
      expect(savedService.totalPrice).toBe(serviceData.totalPrice);
      expect(savedService.savings).toBe(serviceData.savings);
    });
  });
  
  // Test BusinessModel model
  describe('BusinessModel Model', () => {
    it('should create a new business model', async () => {
      // Create a user
      const user = new User({
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@example.com',
        password: 'password123',
        ficoScore: 750,
        role: 'user'
      });
      
      const savedUser = await user.save();
      
      // Create business model
      const modelData = {
        owner: savedUser._id,
        name: 'Eco-Friendly Marketplace',
        businessType: 'sustainable_marketplace',
        description: 'Online marketplace for sustainable products',
        stage: 'validation',
        capitalRequired: 8000,
        isHumanitarian: true,
        milestones: [
          {
            title: 'Market Research',
            description: 'Validate market need and identify target customers',
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'pending'
          }
        ]
      };
      
      const model = new BusinessModel(modelData);
      const savedModel = await model.save();
      
      expect(savedModel._id).toBeDefined();
      expect(savedModel.owner.toString()).toBe(savedUser._id.toString());
      expect(savedModel.businessType).toBe(modelData.businessType);
      expect(savedModel.isHumanitarian).toBe(true);
      expect(savedModel.milestones.length).toBe(1);
    });
  });
});
