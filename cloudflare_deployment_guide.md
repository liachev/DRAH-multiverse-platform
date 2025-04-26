# Cloudflare Deployment Guide for DRAH.tech Domain

## Prerequisites

Before deploying the Multiverse Platform Portal Exchange to your DRAH.tech domain using Cloudflare, ensure you have the following:

1. **Domain Access**:
   - Administrative access to your DRAH.tech domain registrar
   - Ability to modify DNS settings

2. **Cloudflare Account**:
   - A Cloudflare account (create one at https://dash.cloudflare.com/sign-up if needed)
   - Your Account ID (found in the Cloudflare dashboard)
   - Your Zone ID (created when you add your domain to Cloudflare)

3. **Development Environment**:
   - Node.js (v14 or higher)
   - npm (v6 or higher)
   - Wrangler CLI (`npm install -g wrangler`)

## Step 1: Add Your Domain to Cloudflare

1. Log in to your Cloudflare account
2. Click "Add a Site" and enter "drah.tech"
3. Select a plan (Free plan works for initial deployment)
4. Follow the instructions to update your domain's nameservers at your registrar
5. Verify the domain is active in Cloudflare (may take up to 24 hours for DNS propagation)

## Step 2: Configure Wrangler for Deployment

1. Update the `wrangler.toml` file with your specific information:

```toml
# Environment variables
PORT=3000
MONGODB_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=production

# Cloudflare deployment configuration
name = "multiverse-platform"
type = "javascript"
account_id = "your-account-id" # Replace with your actual Account ID
workers_dev = false
route = "drah.tech/*" # Your domain
zone_id = "your-zone-id" # Replace with your actual Zone ID

# Database configuration
[d1_databases]
database_name = "multiverse-platform-db"

# KV namespace configuration
[[kv_namespaces]]
binding = "MULTIVERSE_KV"
id = "your-kv-namespace-id" # Create this in Cloudflare dashboard

# Static asset configuration
[site]
bucket = "./frontend/build"
entry-point = "./backend/src/index.js"

# Build configuration
[build]
command = "npm run build"
upload.format = "service-worker"

# Environment variables for production
[env.production]
PORT = 8080
NODE_ENV = "production"
```

## Step 3: Set Up MongoDB Database

1. Create a MongoDB Atlas account if you don't have one (https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database access (username and password)
4. Whitelist all IP addresses (0.0.0.0/0) for Cloudflare Workers
5. Get your connection string and update it in the `wrangler.toml` file

## Step 4: Build and Deploy the Application

1. Build the frontend:
```bash
cd frontend
npm install
npm run build
```

2. Prepare the backend:
```bash
cd backend
npm install
```

3. Log in to Wrangler:
```bash
wrangler login
```

4. Create KV namespace:
```bash
wrangler kv:namespace create "MULTIVERSE_KV"
```
   - Update the ID in your `wrangler.toml` file

5. Deploy to Cloudflare:
```bash
wrangler publish
```

## Step 5: Configure DNS Records

1. In your Cloudflare dashboard, go to the DNS section for drah.tech
2. Add the following records:
   - Type: A, Name: @, Content: 192.0.2.1 (placeholder IP, Cloudflare will handle the routing)
   - Type: CNAME, Name: www, Content: drah.tech

3. Ensure SSL/TLS is set to "Full" or "Full (Strict)" in the SSL/TLS section

## Step 6: Set Up Custom Domain for API

1. In your Cloudflare dashboard, go to the Workers section
2. Find your deployed worker (multiverse-platform)
3. Click on "Add Route"
4. Add the following routes:
   - Route: drah.tech/*
   - Route: api.drah.tech/* (for API endpoints)

## Step 7: Verify Deployment

1. Visit https://drah.tech to ensure the frontend is working
2. Test API endpoints at https://api.drah.tech/api/properties
3. Verify all features are working correctly:
   - User authentication
   - Property listings
   - Auction system
   - Business solutions
   - AEC DRAH construction services
   - DRAH Finance options

## Troubleshooting

If you encounter issues during deployment:

1. **DNS Issues**:
   - Ensure nameservers are correctly set at your domain registrar
   - Check DNS propagation using tools like https://dnschecker.org

2. **Cloudflare Worker Errors**:
   - Check the Workers section in your Cloudflare dashboard for error logs
   - Verify your Account ID and Zone ID are correct

3. **MongoDB Connection Issues**:
   - Ensure your IP whitelist includes 0.0.0.0/0
   - Verify your connection string is correct

4. **SSL/TLS Issues**:
   - Set SSL/TLS to "Full" in your Cloudflare dashboard
   - Wait for SSL certificate to provision (can take up to 24 hours)

## Ongoing Maintenance

1. **Monitoring**:
   - Set up Cloudflare Analytics to monitor traffic
   - Configure alerts for any issues

2. **Updates**:
   - For code updates, make changes locally, then redeploy using `wrangler publish`
   - Database migrations should be run manually or through a CI/CD pipeline

3. **Scaling**:
   - Upgrade your Cloudflare plan if you need additional resources
   - Scale your MongoDB Atlas cluster as needed

## Support

If you need additional assistance with deployment:
- Cloudflare Documentation: https://developers.cloudflare.com/workers/
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- Contact our support team for platform-specific questions
