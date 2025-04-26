import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AuctionPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    propertyType: '',
    environment: '',
    minPrice: '',
    maxPrice: '',
    isDRAH: false,
    status: 'active'
  });
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const propertyId = queryParams.get('property');

  // Mock data for demonstration
  const mockAuctions = [
    {
      _id: '101',
      property: {
        _id: '1',
        title: 'Modern Beachfront Villa',
        description: 'Luxurious beachfront property with stunning ocean views',
        price: 750000,
        location: {
          city: 'Miami Beach',
          state: 'FL',
        },
        propertyType: 'house',
        environment: 'real_world',
        images: [{ url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914', caption: 'Front view' }],
        isDRAH: true
      },
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      startingBid: 700000,
      currentBid: 725000,
      depositAmount: 2500,
      status: 'active',
      bids: [
        {
          bidder: { firstName: 'John', lastName: 'Doe' },
          amount: 725000,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          isWinning: true
        },
        {
          bidder: { firstName: 'Jane', lastName: 'Smith' },
          amount: 715000,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          isWinning: false
        }
      ],
      deposits: [
        {
          user: { firstName: 'John', lastName: 'Doe' },
          amount: 2500,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        },
        {
          user: { firstName: 'Jane', lastName: 'Smith' },
          amount: 2500,
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        }
      ],
      isDRAH: true
    },
    {
      _id: '102',
      property: {
        _id: '3',
        title: 'Decentraland Premium Plot',
        description: 'Prime location in Decentraland Fashion District',
        price: 25000,
        metaverseLocation: {
          platform: 'Decentraland',
          district: 'Fashion District'
        },
        propertyType: 'metaverse_land',
        environment: 'metaverse',
        images: [{ url: 'https://images.unsplash.com/photo-1558655146-d09347e92766', caption: 'Virtual plot' }],
        isDRAH: false
      },
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      startingBid: 20000,
      currentBid: 22500,
      depositAmount: 850,
      status: 'active',
      bids: [
        {
          bidder: { firstName: 'Michael', lastName: 'Johnson' },
          amount: 22500,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          isWinning: true
        },
        {
          bidder: { firstName: 'Sarah', lastName: 'Williams' },
          amount: 21000,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          isWinning: false
        }
      ],
      deposits: [
        {
          user: { firstName: 'Michael', lastName: 'Johnson' },
          amount: 850,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        },
        {
          user: { firstName: 'Sarah', lastName: 'Williams' },
          amount: 850,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        }
      ],
      isDRAH: false
    },
    {
      _id: '103',
      property: {
        _id: '4',
        title: 'Suburban Family Home',
        description: 'Spacious family home in a quiet suburban neighborhood',
        price: 385000,
        location: {
          city: 'Charlotte',
          state: 'NC'
        },
        propertyType: 'house',
        environment: 'real_world',
        images: [{ url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994', caption: 'Front view' }],
        isDRAH: true
      },
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      startingBid: 350000,
      currentBid: 375000,
      depositAmount: 1500,
      status: 'active',
      bids: [
        {
          bidder: { firstName: 'Robert', lastName: 'Brown' },
          amount: 375000,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          isWinning: true
        },
        {
          bidder: { firstName: 'Emily', lastName: 'Davis' },
          amount: 365000,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          isWinning: false
        }
      ],
      deposits: [
        {
          user: { firstName: 'Robert', lastName: 'Brown' },
          amount: 1500,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        },
        {
          user: { firstName: 'Emily', lastName: 'Davis' },
          amount: 1500,
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        }
      ],
      isDRAH: true
    },
    {
      _id: '104',
      property: {
        _id: '6',
        title: 'Mountain Retreat Cabin',
        description: 'Cozy cabin with breathtaking mountain views',
        price: 275000,
        location: {
          city: 'Asheville',
          state: 'NC'
        },
        propertyType: 'house',
        environment: 'real_world',
        images: [{ url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c', caption: 'Exterior view' }],
        isDRAH: true
      },
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (ended)
      startingBid: 250000,
      currentBid: 268000,
      depositAmount: 1000,
      status: 'ended',
      bids: [
        {
          bidder: { firstName: 'David', lastName: 'Wilson' },
          amount: 268000,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          isWinning: true
        },
        {
          bidder: { firstName: 'Lisa', lastName: 'Miller' },
          amount: 265000,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          isWinning: false
        }
      ],
      deposits: [
        {
          user: { firstName: 'David', lastName: 'Wilson' },
          amount: 1000,
          timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        },
        {
          user: { firstName: 'Lisa', lastName: 'Miller' },
          amount: 1000,
          timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        }
      ],
      isDRAH: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      let filteredAuctions = [...mockAuctions];
      
      // If propertyId is provided, filter by property
      if (propertyId) {
        filteredAuctions = filteredAuctions.filter(auction => auction.property._id === propertyId);
      }
      
      setAuctions(filteredAuctions);
      setLoading(false);
    }, 1000);
  }, [propertyId]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const applyFilters = () => {
    setLoading(true);
    
    // Simulate filtered API call
    setTimeout(() => {
      let filteredAuctions = [...mockAuctions];
      
      // If propertyId is provided, filter by property
      if (propertyId) {
        filteredAuctions = filteredAuctions.filter(auction => auction.property._id === propertyId);
      }
      
      if (filters.propertyType) {
        filteredAuctions = filteredAuctions.filter(a => a.property.propertyType === filters.propertyType);
      }
      
      if (filters.environment) {
        filteredAuctions = filteredAuctions.filter(a => a.property.environment === filters.environment);
      }
      
      if (filters.minPrice) {
        filteredAuctions = filteredAuctions.filter(a => a.currentBid >= parseInt(filters.minPrice));
      }
      
      if (filters.maxPrice) {
        filteredAuctions = filteredAuctions.filter(a => a.currentBid <= parseInt(filters.maxPrice));
      }
      
      if (filters.isDRAH) {
        filteredAuctions = filteredAuctions.filter(a => a.isDRAH);
      }
      
      if (filters.status) {
        filteredAuctions = filteredAuctions.filter(a => a.status === filters.status);
      }
      
      setAuctions(filteredAuctions);
      setLoading(false);
    }, 800);
  };

  const resetFilters = () => {
    setFilters({
      propertyType: '',
      environment: '',
      minPrice: '',
      maxPrice: '',
      isDRAH: false,
      status: 'active'
    });
    
    // Reset to all auctions
    setLoading(true);
    setTimeout(() => {
      let filteredAuctions = [...mockAuctions];
      
      // If propertyId is provided, filter by property
      if (propertyId) {
        filteredAuctions = filteredAuctions.filter(auction => auction.property._id === propertyId);
      }
      
      setAuctions(filteredAuctions);
      setLoading(false);
    }, 500);
  };

  // Function to format remaining time
  const formatTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffMs = end - now;
    
    if (diffMs <= 0) {
      return 'Ended';
    }
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h remaining`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m remaining`;
    } else {
      return `${diffMinutes}m remaining`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Property Auctions</h1>
      
      {/* Auction Process Information */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Three-Step CivicSource Auction Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">1</div>
              <h3 className="text-lg font-semibold">Select</h3>
            </div>
            <p className="text-gray-700">Browse available properties and select ones you're interested in. Research property details and review auction terms.</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">2</div>
              <h3 className="text-lg font-semibold">Deposit</h3>
            </div>
            <p className="text-gray-700">Place a refundable deposit to participate in the auction. This confirms your interest and ability to complete the purchase.</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">3</div>
              <h3 className="text-lg font-semibold">Win</h3>
            </div>
            <p className="text-gray-700">Place your bids before the auction ends. If you're the highest bidder, you win the property and proceed to closing.</p>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Property Type</label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="land">Land</option>
              <option value="metaverse_land">Metaverse Land</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Environment</label>
            <select
              name="environment"
              value={filters.environment}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Environments</option>
              <option value="real_world">Real World</option>
              <option value="metaverse">Metaverse</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="active">Active Auctions</option>
              <option value="ended">Ended Auctions</option>
              <option value="">All Statuses</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Minimum Price"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Maximum Price"
              className="input-field"
            />
          </div>
          
          <div className="flex items-center mt-8">
            <input
              type="checkbox"
              name="isDRAH"
              checked={filters.isDRAH}
              onChange={handleFilterChange}
              className="h-5 w-5 text-blue-600"
            />
            <label className="ml-2 text-gray-700">DRAH Eligible Only</label>
          </div>
        </div>
        
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={resetFilters}
            className="btn-secondary"
          >
            Reset Filters
          </button>
          <button
            onClick={applyFilters}
            className="btn-primary"
          >
            Apply Filters
          </button>
        </div>
      </div>
      
      {/* Auction Listings */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading auctions...</p>
        </div>
      ) : auctions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {auctions.map(auction => (
            <div key={auction._id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Property Image */}
                <div className="h-64 md:h-auto bg-gray-200 relative">
                  {auction.property.images && auction.property.images[0] && (
                    <img 
                      src={auction.property.images[0].url} 
                      alt={auction.property.images[0].caption || auction.property.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {auction.property.isDRAH && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-semibold">
                      DRAH Eligible
                    </div>
                  )}
                  {auction.property.environment === 'metaverse' && (
                    <div className="absolute top-0 left-0 bg-purple-500 text-white px-3 py-1 text-sm font-semibold">
                      Metaverse
                    </div>
                  )}
                </div>
                
                {/* Auction Details */}
                <div className="p-6 md:col-span-2">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        <Link to={`/properties/${auction.property._id}`} className="hover:text-blue-600">
                          {auction.property.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600">
                        {auction.property.environment === 'real_world' ? (
                          <span>{auction.property.location.city}, {auction.property.location.state}</span>
                        ) : (
                          <span>{auction.property.metaverseLocation.platform} - {auction.property.metaverseLocation.district}</span>
                        )}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <div className="text-2xl font-bold text-blue-600">${auction.currentBid.toLocaleString()}</div>
                      <div className="text-gray-500">Current Bid</div>
                      {auction.status === 'active' ? (
                        <div className="text-green-600 font-semibold mt-1">
                          {formatTimeRemaining(auction.endDate)}
                        </div>
                      ) : (
                        <div className="text-red-600 font-semibold mt-1">
                          Auction Ended
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6 line-clamp-2">{auction.property.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <div className="text-gray-500 text-sm">Starting Bid</div>
                      <div className="font-semibold">${auction.startingBid.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Deposit Required</div>
                      <div className="font-semibold">${auction.depositAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Total Bids</div>
                      <div className="font-semibold">{auction.bids.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Participants</div>
                      <div className="font-semibold">{auction.deposits.length}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to={`/properties/${auction.property._id}`} className="btn-secondary text-center">
                      View Property
                    </Link>
                    {auction.status === 'active' && (
                      <button className="btn-primary">
                        Place Bid
                      </button>
                    )}
                    {auction.status === 'active' && (
                      <button className="btn-secondary">
                        Place Deposit
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Auction Progress */}
              {auction.status === 'active' && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-500">Auction Progress</div>
                    <div className="text-sm text-gray-500">
                      Started: {new Date(auction.startDate).toLocaleDateString()} | 
                      Ends: {new Date(auction.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, Math.max(0, 
                          ((Date.now() - new Date(auction.startDate).getTime()) / 
                          (new Date(auction.endDate).getTime() - new Date(auction.startDate).getTime())) * 100
                        ))}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Winning Bid */}
              {auction.status === 'ended' && (
                <div className="px-6 py-4 bg-green-50 border-t border-green-200">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="font-semibold">Winning Bid: ${auction.currentBid.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">
                        Winner: {auction.bids.find(bid => bid.isWinning)?.bidder.firstName} {auction.bids.find(bid => bid.isWinning)?.bidder.lastName}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold mt-4">No auctions found</h3>
          <p className="text-gray-600 mt-2">Try adjusting your filters to find more auctions.</p>
          <button
            onClick={resetFilters}
            className="mt-4 btn-primary"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AuctionPage;
