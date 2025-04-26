# Multiverse Platform Portal Exchange Database Schema

## Overview
This document outlines the database schema for the Multiverse Platform Portal Exchange, supporting both metaverse and real-world environments. The schema is designed to accommodate digital asset trading, real estate management, and business solutions while ensuring scalability, performance, and data integrity.

## Database Technology Selection

### Primary Databases
- **PostgreSQL**: For relational data requiring ACID compliance (users, transactions, properties)
- **MongoDB**: For unstructured and semi-structured data (digital assets, business models)
- **Redis**: For caching and session management

### Blockchain Storage
- **IPFS**: For decentralized storage of digital asset content
- **Ethereum/Solana**: For on-chain storage of ownership records and transaction history

## Core Schema Components

### User Domain

#### Users Table (PostgreSQL)
```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL, -- buyer, seller, developer, entrepreneur
    wallet_address VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### User Profiles (MongoDB)
```json
{
  "user_id": "UUID",
  "avatar_url": "string",
  "bio": "string",
  "social_links": {
    "twitter": "string",
    "linkedin": "string",
    "facebook": "string"
  },
  "preferences": {
    "notification_settings": {},
    "display_settings": {},
    "privacy_settings": {}
  },
  "skills": ["string"],
  "interests": ["string"],
  "humanitarian_goals": ["string"]
}
```

#### User Authentication (PostgreSQL)
```sql
CREATE TABLE auth_tokens (
    token_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    token VARCHAR(255) NOT NULL,
    token_type VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_revoked BOOLEAN DEFAULT FALSE
);
```

### Metaverse Environment

#### Digital Assets (MongoDB)
```json
{
  "asset_id": "string",
  "name": "string",
  "description": "string",
  "creator_id": "UUID",
  "owner_id": "UUID",
  "asset_type": "string", // NFT, virtual land, etc.
  "metadata": {
    "image_url": "string",
    "animation_url": "string",
    "external_url": "string",
    "attributes": [
      {
        "trait_type": "string",
        "value": "any"
      }
    ]
  },
  "blockchain_data": {
    "contract_address": "string",
    "token_id": "string",
    "blockchain": "string",
    "token_standard": "string" // ERC-721, ERC-1155
  },
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "is_listed": "boolean",
  "listing_price": "number",
  "listing_currency": "string"
}
```

#### Virtual Spaces (MongoDB)
```json
{
  "space_id": "string",
  "name": "string",
  "description": "string",
  "owner_id": "UUID",
  "space_type": "string", // gallery, meeting space, etc.
  "geometry_data": {
    "coordinates": {
      "x": "number",
      "y": "number",
      "z": "number"
    },
    "dimensions": {
      "width": "number",
      "height": "number",
      "depth": "number"
    }
  },
  "assets": [
    {
      "asset_id": "string",
      "position": {
        "x": "number",
        "y": "number",
        "z": "number"
      },
      "rotation": {
        "x": "number",
        "y": "number",
        "z": "number"
      },
      "scale": {
        "x": "number",
        "y": "number",
        "z": "number"
      }
    }
  ],
  "access_control": {
    "is_public": "boolean",
    "allowed_users": ["UUID"],
    "allowed_groups": ["string"]
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Digital Asset Transactions (PostgreSQL)
```sql
CREATE TABLE asset_transactions (
    transaction_id UUID PRIMARY KEY,
    asset_id VARCHAR(255) NOT NULL,
    seller_id UUID REFERENCES users(user_id),
    buyer_id UUID REFERENCES users(user_id),
    transaction_type VARCHAR(50) NOT NULL, -- sale, transfer, mint
    price DECIMAL(18, 8),
    currency VARCHAR(50),
    blockchain_tx_hash VARCHAR(255),
    status VARCHAR(50) NOT NULL, -- pending, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);
```

### Real Estate Environment

#### Properties (PostgreSQL)
```sql
CREATE TABLE properties (
    property_id UUID PRIMARY KEY,
    owner_id UUID REFERENCES users(user_id),
    property_type VARCHAR(50) NOT NULL, -- vacant lot, house, commercial
    status VARCHAR(50) NOT NULL, -- available, reserved, sold
    address JSONB NOT NULL,
    location GEOGRAPHY(POINT), -- for geospatial queries
    price DECIMAL(12, 2),
    size_sqft DECIMAL(10, 2),
    zoning VARCHAR(100),
    description TEXT,
    features JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    source VARCHAR(100), -- propwire, manual, etc.
    source_id VARCHAR(255) -- original ID from source
);
```

#### Property Media (PostgreSQL)
```sql
CREATE TABLE property_media (
    media_id UUID PRIMARY KEY,
    property_id UUID REFERENCES properties(property_id),
    media_type VARCHAR(50) NOT NULL, -- image, video, 3d_model
    url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Property Reservations (PostgreSQL)
```sql
CREATE TABLE property_reservations (
    reservation_id UUID PRIMARY KEY,
    property_id UUID REFERENCES properties(property_id),
    user_id UUID REFERENCES users(user_id),
    status VARCHAR(50) NOT NULL, -- pending, confirmed, expired, cancelled
    deposit_amount DECIMAL(12, 2),
    reservation_start TIMESTAMP WITH TIME ZONE NOT NULL,
    reservation_end TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Property Transactions (PostgreSQL)
```sql
CREATE TABLE property_transactions (
    transaction_id UUID PRIMARY KEY,
    property_id UUID REFERENCES properties(property_id),
    seller_id UUID REFERENCES users(user_id),
    buyer_id UUID REFERENCES users(user_id),
    transaction_type VARCHAR(50) NOT NULL, -- sale, lease
    price DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50),
    blockchain_tx_hash VARCHAR(255),
    status VARCHAR(50) NOT NULL, -- pending, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);
```

#### City Resources (PostgreSQL)
```sql
CREATE TABLE city_resources (
    resource_id UUID PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20),
    resource_type VARCHAR(50) NOT NULL, -- assessor, tax, permit, gis
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    api_available BOOLEAN DEFAULT FALSE,
    api_endpoint VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Business Solutions

#### Business Models (MongoDB)
```json
{
  "model_id": "string",
  "name": "string",
  "description": "string",
  "creator_id": "UUID",
  "category": "string",
  "humanitarian_focus": "string",
  "initial_investment": "number",
  "revenue_streams": [
    {
      "name": "string",
      "description": "string",
      "estimated_revenue": "number",
      "timeframe": "string"
    }
  ],
  "cost_structure": [
    {
      "name": "string",
      "description": "string",
      "estimated_cost": "number",
      "frequency": "string"
    }
  ],
  "key_resources": ["string"],
  "key_activities": ["string"],
  "target_audience": ["string"],
  "success_metrics": ["string"],
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "is_template": "boolean",
  "template_category": "string"
}
```

#### Business Projects (MongoDB)
```json
{
  "project_id": "string",
  "user_id": "UUID",
  "name": "string",
  "description": "string",
  "based_on_model": "string", // reference to business_models
  "status": "string", // planning, active, completed
  "progress": {
    "completion_percentage": "number",
    "milestones": [
      {
        "name": "string",
        "description": "string",
        "due_date": "timestamp",
        "completed": "boolean",
        "completed_at": "timestamp"
      }
    ]
  },
  "financials": {
    "initial_investment": "number",
    "current_revenue": "number",
    "current_expenses": "number",
    "profit_loss": "number"
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### AI Recommendations (MongoDB)
```json
{
  "recommendation_id": "string",
  "user_id": "UUID",
  "recommendation_type": "string", // business_idea, investment, property
  "content": {
    "title": "string",
    "description": "string",
    "reasoning": "string",
    "confidence_score": "number"
  },
  "related_entities": [
    {
      "entity_type": "string",
      "entity_id": "string"
    }
  ],
  "user_feedback": {
    "rating": "number",
    "comments": "string",
    "implemented": "boolean"
  },
  "created_at": "timestamp",
  "is_active": "boolean"
}
```

### Cross-Domain Schemas

#### Notifications (PostgreSQL)
```sql
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Activity Log (PostgreSQL)
```sql
CREATE TABLE activity_logs (
    log_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(255),
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Tags (PostgreSQL)
```sql
CREATE TABLE tags (
    tag_id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE entity_tags (
    entity_tag_id UUID PRIMARY KEY,
    tag_id UUID REFERENCES tags(tag_id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tag_id, entity_type, entity_id)
);
```

## Relationships and Indexes

### Key Relationships
- Users to Properties (one-to-many)
- Users to Digital Assets (one-to-many)
- Users to Business Projects (one-to-many)
- Properties to Reservations (one-to-many)
- Properties to Transactions (one-to-many)
- Digital Assets to Transactions (one-to-many)
- Business Models to Business Projects (one-to-many)

### Critical Indexes
```sql
-- User lookup indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_wallet_address ON users(wallet_address);

-- Property search indexes
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_location ON properties USING GIST(location);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_created_at ON properties(created_at);

-- Reservation indexes
CREATE INDEX idx_reservations_property ON property_reservations(property_id);
CREATE INDEX idx_reservations_user ON property_reservations(user_id);
CREATE INDEX idx_reservations_status ON property_reservations(status);
CREATE INDEX idx_reservations_dates ON property_reservations(reservation_start, reservation_end);

-- Transaction indexes
CREATE INDEX idx_property_transactions_property ON property_transactions(property_id);
CREATE INDEX idx_property_transactions_status ON property_transactions(status);
CREATE INDEX idx_asset_transactions_asset ON asset_transactions(asset_id);
CREATE INDEX idx_asset_transactions_status ON asset_transactions(status);

-- City resource indexes
CREATE INDEX idx_city_resources_location ON city_resources(city, state, zip_code);
CREATE INDEX idx_city_resources_type ON city_resources(resource_type);
```

## Data Migration and Seeding

### Initial Data Seeding
- User roles and permissions
- Default business model templates
- Sample property listings for testing
- City resource links for target zip codes
- Tag categories and common tags

### Migration Strategies
- Version-controlled schema changes
- Blue-green deployment for zero-downtime migrations
- Data transformation scripts for schema evolution
- Backup and rollback procedures

## Data Security and Privacy

### Encryption
- Sensitive user data encrypted at rest
- Wallet addresses and financial information encrypted
- Secure key management for encryption/decryption

### Access Controls
- Row-level security policies in PostgreSQL
- Document-level access controls in MongoDB
- Attribute-based access control for sensitive operations

### Audit Trails
- Comprehensive logging of data modifications
- Immutable audit records for compliance
- Retention policies aligned with regulatory requirements

## Performance Considerations

### Sharding Strategy
- User data sharded by user_id
- Property data sharded by geographic region
- Transaction data sharded by time periods

### Caching Layer
- Redis for frequently accessed property listings
- Cache invalidation triggers on data updates
- Time-to-live settings for different data types

### Query Optimization
- Materialized views for complex aggregations
- Denormalization for performance-critical queries
- Asynchronous processing for non-critical operations

## Next Steps
1. Implement database schema in development environment
2. Create data access layer and ORM mappings
3. Develop data validation and integrity checks
4. Implement initial data seeding scripts
5. Set up monitoring and performance testing
