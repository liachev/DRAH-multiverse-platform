import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * AuctionCard component
 * Displays an auction in card format for listings
 */
const AuctionCard = ({ auction }) => {
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

  // Calculate time remaining
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

  function getTimeRemaining() {
    const now = new Date();
    const end = new Date(endDate);
    
    if (now > end) return { expired: true };
    
    const totalSeconds = Math.floor((end - now) / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    
    return { days, hours, minutes, expired: false };
  }

  // Status display configuration
  const statusConfig = {
    'upcoming': { text: 'Upcoming', color: 'yellow' },
    'active': { text: 'Active', color: 'green' },
    'ended': { text: 'Ended', color: 'red' },
    'completed': { text: 'Completed', color: 'blue' },
    'cancelled': { text: 'Cancelled', color: 'gray' }
  }[status] || { text: status, color: 'gray' };

  return (
    <div className="auction-card bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <Link to={`/auctions/${_id}`} className="block">
        <div className="relative">
          <img 
            src={property.images && property.images.length > 0 
              ? property.images[0].url 
              : 'https://via.placeholder.com/300x200?text=No+Image'} 
            alt={property.title} 
            className="w-full h-48 object-cover"
          />
          
          {/* Status Badge */}
          <div className={`absolute top-2 right-2 bg-${statusConfig.color}-600 text-white text-xs font-bold px-2 py-1 rounded`}>
            {statusConfig.text}
          </div>
          
          {/* DRAH Badge */}
          {isDRAH && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              DRAH
            </div>
          )}
          
          {/* Current Bid */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-white font-bold text-xl">
              {currentBid > 0 ? formatCurrency(currentBid) : formatCurrency(startingBid)}
            </p>
            <p className="text-white text-sm">
              {currentBid > 0 ? 'Current Bid' : 'Starting Bid'}
            </p>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{property.title}</h3>
          
          {property.environment === 'real_world' ? (
            <p className="text-sm text-gray-600 mb-2">
              {property.location.city}, {property.location.state} {property.location.zipCode}
            </p>
          ) : (
            <p className="text-sm text-gray-600 mb-2">
              {property.metaverseLocation.platform} - {property.metaverseLocation.district || 'District N/A'}
            </p>
          )}
          
          {/* Time Remaining */}
          {status === 'active' && !timeRemaining.expired && (
            <div className="mb-3 bg-blue-50 p-2 rounded">
              <p className="text-xs text-gray-600">Time Remaining:</p>
              <p className="text-sm font-semibold text-blue-800">
                {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
              </p>
            </div>
          )}
          
          {/* Auction Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Deposit</p>
              <p className="font-medium">{formatCurrency(depositAmount)}</p>
            </div>
            
            <div>
              <p className="text-gray-500">Bids</p>
              <p className="font-medium">{bids ? bids.length : 0}</p>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="mt-4">
            {status === 'active' && (
              <button className="w-full py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors">
                Place Bid
              </button>
            )}
            
            {status === 'upcoming' && (
              <button className="w-full py-2 bg-yellow-600 text-white font-medium rounded hover:bg-yellow-700 transition-colors">
                Place Deposit
              </button>
            )}
            
            {(status === 'ended' || status === 'completed') && (
              <button className="w-full py-2 bg-gray-600 text-white font-medium rounded hover:bg-gray-700 transition-colors">
                View Results
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AuctionCard;
