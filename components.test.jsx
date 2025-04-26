import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PropertyCard from '../components/property/PropertyCard';
import PropertyDetail from '../components/property/PropertyDetail';
import PropertySearch from '../components/property/PropertySearch';
import AuctionCard from '../components/auction/AuctionCard';
import AuctionDetail from '../components/auction/AuctionDetail';
import FinanceCalculator from '../components/finance/FinanceCalculator';
import ConstructionServiceCalculator from '../components/construction/ConstructionServiceCalculator';
import BusinessModelGenerator from '../components/business/BusinessModelGenerator';

// Mock property data
const mockProperty = {
  _id: '123456789',
  title: 'Test Property',
  description: 'This is a test property description',
  price: 250000,
  location: {
    address: '123 Test Street',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345'
  },
  propertyType: 'house',
  environment: 'real_world',
  images: [{ url: 'https://example.com/image.jpg', caption: 'Test Image' }],
  bedrooms: 3,
  bathrooms: 2,
  size: 1800,
  sizeUnit: 'sqft',
  isDRAH: true,
  drahDetails: {
    disasterType: 'hurricane',
    affordableHousingEligible: true,
    constructionReady: true
  },
  status: 'available'
};

// Mock auction data
const mockAuction = {
  _id: '987654321',
  property: mockProperty,
  startDate: new Date(Date.now() - 86400000), // Yesterday
  endDate: new Date(Date.now() + 86400000), // Tomorrow
  startingBid: 200000,
  currentBid: 225000,
  depositAmount: 850,
  status: 'active',
  bids: [
    {
      bidder: { firstName: 'John', lastName: 'Doe' },
      amount: 225000,
      timestamp: new Date(),
      isWinning: true
    }
  ],
  isDRAH: true
};

describe('Frontend Component Tests', () => {
  test('PropertyCard renders correctly', () => {
    render(
      <BrowserRouter>
        <PropertyCard property={mockProperty} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('$250,000')).toBeInTheDocument();
    expect(screen.getByText('Test City, TS 12345')).toBeInTheDocument();
  });

  test('PropertyDetail renders correctly', () => {
    render(
      <BrowserRouter>
        <PropertyDetail property={mockProperty} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('$250,000')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('This is a test property description')).toBeInTheDocument();
    expect(screen.getByText('DRAH Program Details')).toBeInTheDocument();
  });

  test('PropertySearch renders correctly', () => {
    render(<PropertySearch />);
    expect(screen.getByPlaceholderText('Search by location, keyword, or zip code')).toBeInTheDocument();
    expect(screen.getByText('Property Type')).toBeInTheDocument();
    expect(screen.getByText('Price Range')).toBeInTheDocument();
  });

  test('AuctionCard renders correctly', () => {
    render(
      <BrowserRouter>
        <AuctionCard auction={mockAuction} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('$225,000')).toBeInTheDocument();
    expect(screen.getByText('Current Bid')).toBeInTheDocument();
    expect(screen.getByText('Place Bid')).toBeInTheDocument();
  });

  test('AuctionDetail renders correctly', () => {
    render(
      <BrowserRouter>
        <AuctionDetail auction={mockAuction} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('Auction Information')).toBeInTheDocument();
    expect(screen.getByText('Three-Step Process')).toBeInTheDocument();
    expect(screen.getByText('Place Your Bid')).toBeInTheDocument();
  });

  test('FinanceCalculator renders correctly', () => {
    render(<FinanceCalculator />);
    expect(screen.getByText('DRAH Finance Calculator')).toBeInTheDocument();
    expect(screen.getByText('Loan Amount:')).toBeInTheDocument();
    expect(screen.getByText('Payment Summary')).toBeInTheDocument();
    expect(screen.getByText('DRAH Finance Benefits')).toBeInTheDocument();
  });

  test('ConstructionServiceCalculator renders correctly', () => {
    render(<ConstructionServiceCalculator />);
    expect(screen.getByText('AEC DRAH Construction Services')).toBeInTheDocument();
    expect(screen.getByText('Package Type')).toBeInTheDocument();
    expect(screen.getByText('Construction Estimate')).toBeInTheDocument();
    expect(screen.getByText('AEC DRAH Construction Benefits')).toBeInTheDocument();
  });

  test('BusinessModelGenerator renders correctly', () => {
    render(<BusinessModelGenerator />);
    expect(screen.getByText('AI-Driven Business Modeling')).toBeInTheDocument();
    expect(screen.getByText('Select Business Type')).toBeInTheDocument();
    expect(screen.getByText('Business Stage')).toBeInTheDocument();
    expect(screen.getByText('Starting Capital:')).toBeInTheDocument();
  });
});
