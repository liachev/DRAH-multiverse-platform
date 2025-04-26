# DRAH Finance Documentation

## Overview

DRAH Finance is a specialized mortgage solution designed to assist lot buyers with alternative financing options. The service is specifically tailored for disaster recovery and affordable housing initiatives, offering flexible requirements to make homeownership more accessible.

## Key Features

- **Minimum FICO Score of 500**: Significantly lower than traditional mortgage requirements
- **No PMI Required**: Save thousands with no Private Mortgage Insurance requirement
- **No Down Payment Required**: Purchase property without the need for a down payment
- **Fixed Interest Rates**: Stable, predictable payments throughout the loan term
- **Multiple Loan Options**: Standard mortgage, construction-to-permanent, and rehabilitation loans
- **Integration with DRAH Construction Services**: Seamless transition from lot purchase to home construction

## Loan Options

### Standard DRAH Mortgage
- Basic mortgage option for DRAH properties
- Interest Rate Range: 3.5% - 5.5%
- Terms: 15, 20, or 30 years
- No PMI required
- No down payment required
- Minimum FICO score of 500
- Fixed interest rates

### DRAH Construction-to-Permanent Loan
- Combined loan for lot purchase and home construction
- Interest Rate Range: 4.0% - 6.0%
- Terms: 15, 20, or 30 years
- Single loan for both land purchase and construction
- No PMI required
- No down payment required
- Minimum FICO score of 500
- Converts to permanent mortgage after construction

### DRAH Rehabilitation Loan
- Loan for purchasing and rehabilitating existing properties
- Interest Rate Range: 3.75% - 5.75%
- Terms: 15, 20, or 30 years
- Finances both purchase and rehabilitation costs
- No PMI required
- No down payment required
- Minimum FICO score of 500
- Rehabilitation funds held in escrow

## Application Process

1. **Pre-Qualification**
   - Check eligibility and get pre-qualified for a loan amount
   - Basic information required: FICO score, income, desired loan amount
   - Instant eligibility check and payment estimation

2. **Application**
   - Complete full mortgage application with required documentation
   - Submit necessary documents: ID, income verification, employment verification
   - Application status tracking through the platform

3. **Underwriting**
   - Loan undergoes review and approval process
   - Verification of submitted documents
   - Final loan terms determination

4. **Closing**
   - Sign final paperwork and complete the loan process
   - Funds disbursement for property purchase
   - For construction loans, establishment of draw schedule

## Required Documents

- Government-issued ID (driver's license, passport, etc.)
- Income verification (recent pay stubs, W-2s, or tax returns)
- Employment verification (proof of employment and employment history)
- Credit report authorization
- Bank statements (recent statements showing financial history)

## Integration with Platform

DRAH Finance is fully integrated with the Multiverse Platform Portal Exchange, providing seamless connections between:

- Property listings and financing options
- Auction system and pre-qualification
- AEC DRAH construction services and construction-to-permanent loans
- User profiles and application tracking

## API Documentation

### Finance Information

- `GET /api/drah-finance/information`: Get DRAH Finance information and options

### Eligibility and Calculations

- `POST /api/drah-finance/check-eligibility`: Check eligibility for DRAH Finance
- `POST /api/drah-finance/calculate-payment`: Calculate mortgage payment

### Application Management

- `POST /api/drah-finance/pre-qualify`: Submit pre-qualification application
- `POST /api/drah-finance/apply`: Submit full application
- `GET /api/drah-finance/user/:userId`: Get user's finance applications
- `GET /api/drah-finance/:financeId`: Get finance application details
- `PUT /api/drah-finance/:financeId/status`: Update application status (admin only)

### Statistics

- `GET /api/drah-finance/statistics/summary`: Get finance statistics

## Database Schema

The DRAHFinance model includes the following key fields:

- `userId`: Reference to the User model
- `propertyId`: Reference to the Property model
- `ficoScore`: Minimum 500
- `loanAmount`: Amount of the loan
- `interestRate`: Interest rate percentage
- `loanTerm`: 15, 20, or 30 years
- `monthlyPayment`: Calculated monthly payment
- `applicationStatus`: pre_qualification, application_submitted, under_review, approved, denied, closed
- `applicationDate`: Date of application
- `approvalDate`: Date of approval (if approved)
- `closingDate`: Date of closing (if closed)
- `documents`: Array of submitted documents
- `income`: Income information and verification status
- `employment`: Employment information and verification status

## Frontend Components

- `DRAHFinanceCalculator`: Interactive calculator for payment estimation and eligibility checking
- `DRAHFinanceApplication`: Form for submitting pre-qualification and full applications
- `DRAHFinanceStatus`: Dashboard for tracking application status
- `DRAHFinanceOptions`: Information about available loan options

## User Experience

1. User browses properties on the platform
2. User selects a property and views details
3. User accesses the DRAH Finance calculator to estimate payments
4. User completes pre-qualification to check eligibility
5. If eligible, user submits full application
6. User tracks application status through the platform
7. Upon approval, user completes closing process
8. For construction loans, user works with AEC DRAH for home building

## Benefits for Users

- Access to homeownership with lower credit requirements
- Significant savings with no PMI requirement
- Ability to purchase property without saving for a down payment
- Streamlined process for lot purchase and home construction
- Integrated experience within the Multiverse Platform Portal Exchange
