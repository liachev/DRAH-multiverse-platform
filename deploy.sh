#!/bin/bash

# Deployment script for Multiverse Platform Portal Exchange

echo "Starting deployment process for Multiverse Platform Portal Exchange..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js before proceeding."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm before proceeding."
    exit 1
fi

# Check if MongoDB is installed and running
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is not installed. Please install MongoDB before proceeding."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "MongoDB is not running. Starting MongoDB..."
    sudo systemctl start mongod
fi

echo "Installing backend dependencies..."
cd /home/ubuntu/backend
npm install

echo "Installing frontend dependencies..."
cd /home/ubuntu/frontend
npm install

echo "Building frontend..."
npm run build

echo "Setting up environment variables..."
cd /home/ubuntu/backend
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "PORT=3000" > .env
    echo "MONGODB_URI=mongodb://localhost:27017/multiverse-platform" >> .env
    echo "JWT_SECRET=multiverse-platform-secret-key-$(date +%s)" >> .env
    echo "NODE_ENV=production" >> .env
fi

echo "Running database migrations..."
cd /home/ubuntu/backend
node scripts/migrate.js

echo "Generating test data..."
curl -X POST http://localhost:3000/api/testing/generate-test-data -H "Content-Type: application/json" -d '{"count": 20}'

echo "Running tests..."
cd /home/ubuntu/backend
npm test

echo "Starting server..."
npm start

echo "Deployment complete! The Multiverse Platform Portal Exchange is now running at http://localhost:3000"
echo "To access the platform, use the following credentials:"
echo "Username: testuser"
echo "Password: password123"
echo ""
echo "For production deployment, please follow these steps:"
echo "1. Update the wrangler.toml file with your Cloudflare account details"
echo "2. Run 'npx wrangler publish' to deploy to Cloudflare"
echo "3. Set up a custom domain in your Cloudflare dashboard"
echo ""
echo "Thank you for using the Multiverse Platform Portal Exchange!"
