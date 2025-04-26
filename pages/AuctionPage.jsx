import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AuctionPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: 'all',
    priceMin: '',
    priceMax: '',
    location: ''
  });

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setAuctions([
        {
          id: 1,
          propertyId: 1,
          title: 'Vacant Lot in St. Bernard Parish',
          price: 45000,
          currentBid: 45000,
          location: 'St. Bernard Parish, LA 70032',
          status: 'upcoming',
          startDate: '2025-05-15T10:00:00',
          endDate: '2025-05-15T14:00:00',
          depositAmount: 850,
          bidCount: 0,
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
        },
        {
          id: 2,
          propertyId: 2,
          title: 'Corner Lot in Chalmette',
          price: 52500,
          currentBid: 53500,
          location: 'Chalmette, LA 70043',
          status: 'active',
          startDate: '2025-04-10T10:00:00',
          endDate: '2025-04-17T14:00:00',
          depositAmount: 850,
          bidCount: 3,
          image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
        },
        {
          id: 3,
          propertyId: 3,
          title: 'Waterfront Lot in Violet',
          price: 68000,
          currentBid: 72500,
          location: 'Violet, LA 70092',
          status: 'active',
          startDate: '2025-04-05T10:00:00',
          endDate: '2025-04-19T14:00:00',
          depositAmount: 850,
          bidCount: 8,
          image: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
        },
        {
          id: 4,
          propertyId: 4,
          title: 'Residential Lot in Meraux',
          price: 49500,
          currentBid: 55000,
          location: 'Meraux, LA 70075',
          status: 'ended',
          startDate: '2025-03-15T10:00:00',
          endDate: '2025-03-22T14:00:00',
          depositAmount: 850,
          bidCount: 12,
          image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80'
        },
        {
          id: 5,
          propertyId: 5,
          title: 'Commercial Lot in St. Bernard',
          price: 85000,
          currentBid: 92000,
          location: 'St. Bernard, LA 70085',
          status: 'ended',
          startDate: '2025-03-10T10:00:00',
          endDate: '2025-03-17T14:00:00',
          depositAmount: 850,
          bidCount: 15,
          image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=996&q=80'
        },
        {
          id: 6,
          propertyId: 6,
          title: 'Residential Lot with Utilities',
          price: 59000,
          currentBid: 59000,
          location: 'Chalmette, LA 70043',
          status: 'upcoming',
          startDate: '2025-05-20T10:00:00',
          endDate: '2025-05-27T14:00:00',
          depositAmount: 850,
          bidCount: 0,
          image: 'https://images.unsplash.com/photo-1543965860-0a2c7d5a333d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const filteredAuctions = auctions.filter(auction => {
    // Filter by status
    if (filter.status !== 'all' && auction.status !== filter.status) {
      return false;
    }
    
    // Filter by min price
    if (filter.priceMin && auction.price < parseInt(filter.priceMin)) {
      return false;
    }
    
    // Filter by max price
    if (filter.priceMax && auction.price > parseInt(filter.priceMax)) {
      return false;
    }
    
    // Filter by location
    if (filter.location && !auction.location.toLowerCase().includes(filter.location.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'upcoming':
        return <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">Upcoming</span>;
      case 'active':
        return <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">Active</span>;
      case 'ended':
        return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">Ended</span>;
      default:
        return null;
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Property Auctions</h1>
        
        {/* Auction Process Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Three-Step Auction Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-blue-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Select Property</h3>
              <p className="text-gray-600">Browse available properties and select the ones you're interested in.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-blue-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Place Deposit</h3>
              <p className="text-gray-600">Place a refundable $850 deposit to participate in the auction.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-blue-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Win Auction</h3>
              <p className="text-gray-600">If you win, complete payment within 24 hours to secure the property.</p>
            </div>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                name="priceMin"
                value={filter.priceMin}
                onChange={handleFilterChange}
                placeholder="Min Price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                name="priceMax"
                value={filter.priceMax}
                onChange={handleFilterChange}
                placeholder="Max Price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={filter.location}
                onChange={handleFilterChange}
                placeholder="City, ZIP, or Parish"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading auctions...</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">{filteredAuctions.length} auctions found</p>
            
            <div className="grid grid-cols-1 gap-6">
              {filteredAuctions.map(auction => (
                <div key={auction.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img 
                        src={auction.image} 
                        alt={auction.title} 
                        className="h-64 w-full object-cover md:h-full"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">{auction.title}</h3>
                        {getStatusBadge(auction.status)}
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {auction.location}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-500">Starting Price</p>
                          <p className="font-semibold">${auction.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Current Bid</p>
                          <p className="font-semibold">${auction.currentBid.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Deposit Required</p>
                          <p className="font-semibold">${auction.depositAmount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Bids</p>
                          <p className="font-semibold">{auction.bidCount}</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        {auction.status === 'upcoming' ? (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Auction Starts</p>
                            <p className="font-medium">{formatDate(auction.startDate)}</p>
                          </div>
                        ) : auction.status === 'active' ? (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Auction Ends</p>
                            <p className="font-medium">{formatDate(auction.endDate)}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Auction Ended</p>
                            <p className="font-medium">{formatDate(auction.endDate)}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link to={`/properties/${auction.propertyId}`} className="btn btn-secondary">
                          View Property
                        </Link>
                        {auction.status === 'upcoming' && (
                          <Link to={`/auctions/${auction.id}`} className="btn btn-primary">
                            Set Reminder
                          </Link>
                        )}
                        {auction.status === 'active' && (
                          <Link to={`/auctions/${auction.id}`} className="btn btn-primary">
                            Place Deposit & Bid
                          </Link>
                        )}
                        {auction.status === 'ended' && (
                          <Link to={`/auctions/${auction.id}`} className="btn btn-secondary">
                            View Results
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredAuctions.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No auctions found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to find more auctions.</p>
                <button 
                  onClick={() => setFilter({
                    status: 'all',
                    priceMin: '',
                    priceMax: '',
                    location: ''
                  })}
                  className="btn btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuctionPage;
