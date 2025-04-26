#!/bin/bash

# Test script for Multiverse Platform
# This script tests all components of the platform to ensure they work together properly

echo "Starting platform functionality tests..."

# Create test directory if it doesn't exist
mkdir -p tests/results

# Test 1: Frontend Build Test
echo "Testing frontend build..."
cd frontend && npm run build
if [ $? -eq 0 ]; then
  echo "✅ Frontend build test passed"
  echo "Frontend build test: PASSED" >> ../tests/results/test_results.log
else
  echo "❌ Frontend build test failed"
  echo "Frontend build test: FAILED" >> ../tests/results/test_results.log
fi
cd ..

# Test 2: Backend Functions Test
echo "Testing backend functions..."
cd backend && npm test
if [ $? -eq 0 ]; then
  echo "✅ Backend functions test passed"
  echo "Backend functions test: PASSED" >> ../tests/results/test_results.log
else
  echo "❌ Backend functions test failed"
  echo "Backend functions test: FAILED" >> ../tests/results/test_results.log
fi
cd ..

# Test 3: Database Connection Test
echo "Testing MongoDB connection..."
node -e "
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI || 'mongodb+srv://test:test@cluster0.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
"

if [ $? -eq 0 ]; then
  echo "✅ Database connection test passed"
  echo "Database connection test: PASSED" >> tests/results/test_results.log
else
  echo "❌ Database connection test failed"
  echo "Database connection test: FAILED" >> tests/results/test_results.log
fi

# Test 4: API Endpoint Test
echo "Testing API endpoints..."
node -e "
const fetch = require('node-fetch');
const baseUrl = process.env.API_URL || 'http://localhost:8888/.netlify/functions';

async function testEndpoints() {
  try {
    // Test property API
    const propertyResponse = await fetch(\`\${baseUrl}/propertyApi\`);
    if (!propertyResponse.ok) throw new Error('Property API test failed');
    
    // Test auction API
    const auctionResponse = await fetch(\`\${baseUrl}/auctionApi\`);
    if (!auctionResponse.ok) throw new Error('Auction API test failed');
    
    // Test finance API
    const financeResponse = await fetch(\`\${baseUrl}/financeApi\`);
    if (!financeResponse.ok) throw new Error('Finance API test failed');
    
    // Test construction API
    const constructionResponse = await fetch(\`\${baseUrl}/constructionApi\`);
    if (!constructionResponse.ok) throw new Error('Construction API test failed');
    
    // Test business API
    const businessResponse = await fetch(\`\${baseUrl}/businessApi\`);
    if (!businessResponse.ok) throw new Error('Business API test failed');
    
    console.log('All API endpoint tests passed');
    process.exit(0);
  } catch (error) {
    console.error('API endpoint test failed:', error);
    process.exit(1);
  }
}

testEndpoints();
"

if [ $? -eq 0 ]; then
  echo "✅ API endpoint test passed"
  echo "API endpoint test: PASSED" >> tests/results/test_results.log
else
  echo "❌ API endpoint test failed"
  echo "API endpoint test: FAILED" >> tests/results/test_results.log
fi

# Test 5: Integration Test
echo "Running integration tests..."
node -e "
const fetch = require('node-fetch');
const baseUrl = process.env.API_URL || 'http://localhost:8888/.netlify/functions';

async function runIntegrationTests() {
  try {
    // Test property creation and retrieval
    const propertyData = {
      title: 'Test Property',
      description: 'Test property description',
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
      isDRAH: true
    };
    
    // Create property
    const createResponse = await fetch(\`\${baseUrl}/propertyApi\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData)
    });
    
    if (!createResponse.ok) throw new Error('Property creation failed');
    
    const { data: createdProperty } = await createResponse.json();
    
    // Retrieve property
    const getResponse = await fetch(\`\${baseUrl}/propertyApi/\${createdProperty._id}\`);
    if (!getResponse.ok) throw new Error('Property retrieval failed');
    
    console.log('Integration test passed');
    process.exit(0);
  } catch (error) {
    console.error('Integration test failed:', error);
    process.exit(1);
  }
}

runIntegrationTests();
"

if [ $? -eq 0 ]; then
  echo "✅ Integration test passed"
  echo "Integration test: PASSED" >> tests/results/test_results.log
else
  echo "❌ Integration test failed"
  echo "Integration test: FAILED" >> tests/results/test_results.log
fi

# Generate test summary
echo "Generating test summary..."
passed=$(grep -c "PASSED" tests/results/test_results.log)
failed=$(grep -c "FAILED" tests/results/test_results.log)
total=$((passed + failed))

echo "Test Summary:" > tests/results/summary.log
echo "Total tests: $total" >> tests/results/summary.log
echo "Passed: $passed" >> tests/results/summary.log
echo "Failed: $failed" >> tests/results/summary.log
echo "Success rate: $(( (passed * 100) / total ))%" >> tests/results/summary.log

cat tests/results/summary.log

echo "Platform functionality tests completed."

# Exit with error if any tests failed
if [ $failed -gt 0 ]; then
  exit 1
else
  exit 0
fi
