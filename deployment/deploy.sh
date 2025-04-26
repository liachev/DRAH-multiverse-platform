#!/bin/bash

# Multiverse Platform Portal Exchange Deployment Script
# This script handles the complete deployment process for the platform

echo "Starting deployment of Multiverse Platform Portal Exchange..."

# Step 1: Install dependencies
echo "Installing dependencies..."
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Step 2: Set up environment variables
echo "Setting up environment variables..."
# Create .env file for local development
cat > .env << EOL
MONGODB_URI=mongodb+srv://demo-user:demo-password@cluster0.mongodb.net/multiverse-platform?retryWrites=true&w=majority
JWT_SECRET=multiverse_platform_secret_key
NODE_ENV=production
EOL

# Step 3: Build the frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

# Step 4: Prepare backend functions for serverless deployment
echo "Preparing backend functions..."
mkdir -p backend/functions/api
cp -r backend/models backend/functions/
cp -r backend/routes backend/functions/
cp backend/index.js backend/functions/api.js

# Step 5: Deploy to Netlify
echo "Deploying to Netlify..."
# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Deploy to Netlify
netlify deploy --prod --dir=frontend/dist --functions=backend/functions

echo "Deployment completed successfully!"
echo "Your Multiverse Platform Portal Exchange is now live at the URL provided above."
