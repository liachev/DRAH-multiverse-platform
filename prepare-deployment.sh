#!/bin/bash

# Multiverse Platform Portal Exchange Deployment Script
# This script prepares the project for deployment to Netlify

echo "Preparing Multiverse Platform Portal Exchange for deployment..."

# Create a deployment package
echo "Creating deployment package..."
mkdir -p /home/ubuntu/deployment
cp -r /home/ubuntu/serverless-multiverse-platform/* /home/ubuntu/deployment/

# Create a README file with deployment instructions
cat > /home/ubuntu/deployment/DEPLOY_INSTRUCTIONS.md << EOL
# Multiverse Platform Portal Exchange - Deployment Instructions

This document provides instructions for deploying the Multiverse Platform Portal Exchange to Netlify.

## Prerequisites

1. A Netlify account
2. A MongoDB Atlas account (for database)
3. Node.js and npm installed

## Deployment Steps

1. **Set up MongoDB Atlas**
   - Create a new cluster in MongoDB Atlas
   - Create a database user with read/write permissions
   - Add your IP address to the IP whitelist
   - Get your connection string

2. **Deploy to Netlify**
   - Log in to your Netlify account
   - Click "New site from Git"
   - Connect to your Git repository
   - Set the build command to \`npm run build\`
   - Set the publish directory to \`frontend/dist\`
   - Set the functions directory to \`backend/functions\`
   - Add the following environment variables:
     - MONGODB_URI: Your MongoDB Atlas connection string
     - JWT_SECRET: A secure random string for JWT token signing

3. **Verify Deployment**
   - Once deployment is complete, visit your Netlify site URL
   - Test the frontend functionality
   - Test the API endpoints

## Automated Deployment

Alternatively, you can use the included \`deploy.sh\` script to automate the deployment process:

\`\`\`bash
./deploy.sh
\`\`\`

This script will:
1. Install all dependencies
2. Set up environment variables
3. Build the frontend
4. Prepare backend functions
5. Deploy to Netlify

## Troubleshooting

If you encounter any issues during deployment:
1. Check the Netlify deployment logs
2. Verify your MongoDB Atlas connection string
3. Ensure all environment variables are correctly set
EOL

# Create a zip file of the deployment package
echo "Creating zip file..."
cd /home/ubuntu
zip -r multiverse-platform-deployment.zip deployment/

echo "Deployment preparation completed successfully!"
echo "The deployment package is available at: /home/ubuntu/multiverse-platform-deployment.zip"
echo "Follow the instructions in DEPLOY_INSTRUCTIONS.md to deploy the platform to Netlify."
