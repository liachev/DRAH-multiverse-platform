import React, { useState } from 'react';

/**
 * AuctionDetail component
 * Displays detailed information about an auction and allows bidding
 */
const AuctionDetail = ({ auction }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

  // If auction is not provided, we would fetch it using the ID from URL params
  if (!auction) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const {
    _id,
    property,
    startDate,
    endDate,
    startingBid,
    currentBid,
    depositAmount,
    status,
    bids,
    deposits,
    winner,
    winningBid,
    paymentDue,
    paymentStatus,
    isBundle,
    bundledProperties,
    isDRAH
  } = auction;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate time remaining
  function getTimeRemaining() {
    const now = new Date();
    const end = new Date(endDate);
    
    if (now > end) return { expired: true };
    
    const totalSeconds = Math.floor((end - now) / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;
    
    return { days, hours, minutes, seconds, expired: false };
  }

  // Calculate minimum bid
  const minimumBid = currentBid > 0 ? currentBid + 100 : startingBid;

  // Handle bid submission
  const handleBidSubmit = (e) => {
    e.preventDefault();
    // This would be implemented in step 005 when we create the backend functions
    console.log('Submitting bid:', bidAmount);
  };

  // Handle deposit submission
  const handleDepositSubmit = (e) => {
    e.preventDefault();
    // This would be implemented in step 005 when we create the backend functions
    console.log('Submitting deposit:', depositAmount);
  };

  // Status display configuration
  const statusConfig = {
    'upcoming': { text: 'Upcoming', color: 'yellow' },
    'active': { text: 'Active', color: 'green' },
    'ended': { text: 'Ended', color: 'red' },
    'completed': { text: 'Completed', color: 'blue' },
    'cancelled': { text: 'Cancelled', color: 'gray' }
  }[status] || { text: status, color: 'gray' };

  return (
    <div className="auction-detail bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 text-white p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
            <p className="text-gray-300">
              {property.environment === 'real_world' 
                ? `${property.location.city}, ${property.location.state} ${property.location.zipCode}`
                : `${property.metaverseLocation.platform} - ${property.metaverseLocation.district || 'District N/A'}`
              }
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
            <div className={`px-3 py-1 rounded-full bg-${statusConfig.color}-600 text-white text-sm font-bold mb-2`}>
              {statusConfig.text}
            </div>
            
            {isDRAH && (
              <div className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-bold">
                DRAH Property
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Image and Details */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img 
                src={property.images && property.images.length > 0 
                  ? property.images[0].url 
                  : 'https://via.placeholder.com/800x500?text=No+Image'} 
                alt={property.title} 
                className="w-full h-auto rounded-lg"
              />
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Property Type</p>
                  <p className="font-medium capitalize">
                    {property.propertyType.replace('_', ' ')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Environment</p>
                  <p className="font-medium">
                    {property.environment === 'real_world' ? 'Real World' : 'Metaverse'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-medium">
                    {property.size} {property.sizeUnit}
                  </p>
                </div>
                
                {property.environment === 'real_world' && property.propertyType === 'house' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Bedrooms</p>
                      <p className="font-medium">{property.bedrooms}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <p className="font-medium">{property.bathrooms}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-700">{property.description}</p>
            </div>
            
            {/* Bundle Properties */}
            {isBundle && bundledProperties && bundledProperties.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Bundled Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bundledProperties.map((bundledProperty, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <h3 className="font-medium">{bundledProperty.title}</h3>
                      <p className="text-sm text-gray-600">
                        {bundledProperty.environment === 'real_world' 
                          ? `${bundledProperty.location.city}, ${bundledProperty.location.state}`
                          : `${bundledProperty.metaverseLocation.platform}`
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* DRAH Details */}
            {isDRAH && property.drahDetails && (
              <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">DRAH Program Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.drahDetails.disasterType && (
                    <div>
                      <p className="text-sm text-blue-700">Disaster Type</p>
                      <p className="font-semibold capitalize">{property.drahDetails.disasterType}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-blue-700">Affordable Housing Eligible</p>
                    <p className="font-semibold">{property.drahDetails.affordableHousingEligible ? 'Yes' : 'No'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-700">Construction Ready</p>
                    <p className="font-semibold">{property.drahDetails.constructionReady ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Auction Information and Bidding */}
          <div className="lg:col-span-1">
            {/* Auction Status */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Auction Information</h2>
              
              {/* Current/Starting Bid */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  {currentBid > 0 ? 'Current Bid' : 'Starting Bid'}
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {currentBid > 0 ? formatCurrency(currentBid) : formatCurrency(startingBid)}
                </p>
              </div>
              
              {/* Time Remaining */}
              {status === 'active' && !timeRemaining.expired && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Time Remaining</p>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    <div className="bg-gray-800 text-white p-2 rounded text-center">
                      <p className="text-xl font-bold">{timeRemaining.days}</p>
                      <p className="text-xs">Days</p>
                    </div>
                    <div className="bg-gray-800 text-white p-2 rounded text-center">
                      <p className="text-xl font-bold">{timeRemaining.hours}</p>
                      <p className="text-xs">Hours</p>
                    </div>
                    <div className="bg-gray-800 text-white p-2 rounded text-center">
                      <p className="text-xl font-bold">{timeRemaining.minutes}</p>
                      <p className="text-xs">Mins</p>
                    </div>
                    <div className="bg-gray-800 text-white p-2 rounded text-center">
                      <p className="text-xl font-bold">{timeRemaining.seconds}</p>
                      <p className="text-xs">Secs</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Auction Dates */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{formatDate(startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium">{formatDate(endDate)}</p>
                  </div>
                </div>
              </div>
              
              {/* Deposit Information */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">Required Deposit</p>
                <p className="font-medium">{formatCurrency(depositAmount)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  A deposit is required to participate in this auction. 
                  Deposits are fully refundable if you don't win.
                </p>
              </div>
              
              {/* Bid Count */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">Total Bids</p>
                <p className="font-medium">{bids ? bids.length : 0}</p>
              </div>
              
              {/* Winner Information (if auction ended) */}
              {(status === 'ended' || status === 'completed') && winner && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-500">Winning Bid</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(winningBid)}</p>
                  
                  {paymentDue && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Payment Due</p>
                      <p className="font-medium">{formatDate(paymentDue)}</p>
                      <p className="text-sm mt-1">
                        Status: <span className="font-medium capitalize">{paymentStatus}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Three-Step Process */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Three-Step Process</h2>
              
              <div className="flex mb-4">
                <div className="flex-1 text-center">
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${status !== 'upcoming' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <p className="text-sm mt-1">Select</p>
                </div>
                <div className="flex-1 text-center">
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${deposits && deposits.length > 0 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <p className="text-sm mt-1">Deposit</p>
                </div>
                <div className="flex-1 text-center">
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${winner ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <p className="text-sm mt-1">Win</p>
                </div>
              </div>
            </div>
            
            {/* Action Area */}
            {status === 'upcoming' && (
              <div className="mb-6">
                <button 
                  onClick={() => setShowDepositForm(!showDepositForm)}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
                >
                  Place ${depositAmount} Deposit
                </button>
                
                {showDepositForm && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Payment Information</h3>
                    <form onSubmit={handleDepositSubmit}>
                      {/* Payment form fields would go here */}
                      <button 
                        type="submit"
                        className="w-full py-2 mt-4 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors"
                      >
                        Submit Deposit
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
            
            {status === 'active' && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Place Your Bid</h3>
                <form onSubmit={handleBidSubmit}>
                  <div className="mb-4">
                    <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Bid Amount (Minimum: {formatCurrency(minimumBid)})
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <input
                        type="number"
                        id="bidAmount"
                        name="bidAmount"
                        min={minimumBid}
                        step="100"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
                    disabled={!bidAmount || parseFloat(bidAmount) < minimumBid}
                  >
                    Place Bid
                  </button>
                </form>
              </div>
            )}
            
            {/* Recent Bids */}
            {bids && bids.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Recent Bids</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bidder
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bids.slice(0, 5).map((bid, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {bid.bidder.firstName.charAt(0)}. {bid.bidder.lastName}
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatCurrency(bid.amount)}
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(bid.timestamp).toLocaleTimeString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
