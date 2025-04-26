import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

/**
 * PropertyDetail component
 * Displays detailed information about a property
 */
const PropertyDetail = ({ property }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  
  // If property is not passed as prop, we would fetch it using the ID from URL params
  const { id } = useParams();
  
  // In a real implementation, we would fetch the property if not provided as prop
  useEffect(() => {
    if (!property && id) {
      // Fetch property data from API
      // This would be implemented in step 005 when we create the backend functions
    }
  }, [property, id]);

  if (!property) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const {
    title,
    description,
    price,
    location,
    metaverseLocation,
    propertyType,
    environment,
    images,
    bedrooms,
    bathrooms,
    size,
    sizeUnit,
    isDRAH,
    drahDetails,
    cityResources,
    features,
    status
  } = property;

  // Format price with commas
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price);

  // Property type display text
  const propertyTypeText = {
    'vacant_lot': 'Vacant Lot',
    'house': 'House',
    'commercial': 'Commercial',
    'metaverse_land': 'Metaverse Land',
    'metaverse_building': 'Metaverse Building'
  }[propertyType] || propertyType;

  // Status display text and color
  const statusConfig = {
    'available': { text: 'Available', color: 'green' },
    'pending': { text: 'Pending', color: 'yellow' },
    'sold': { text: 'Sold', color: 'red' },
    'auction': { text: 'Auction', color: 'blue' },
    'reserved': { text: 'Reserved', color: 'purple' }
  }[status] || { text: status, color: 'gray' };

  return (
    <div className="property-detail bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image Gallery */}
      <div className="relative">
        {images && images.length > 0 ? (
          <>
            <img 
              src={images[activeImage].url} 
              alt={images[activeImage].caption || title} 
              className="w-full h-96 object-cover"
            />
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-3 h-3 rounded-full ${index === activeImage ? 'bg-white' : 'bg-white/50'}`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
            
            {/* Previous/Next Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
                  aria-label="Previous image"
                >
                  &#10094;
                </button>
                <button
                  onClick={() => setActiveImage(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
                  aria-label="Next image"
                >
                  &#10095;
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No images available</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 bg-${statusConfig.color}-600 text-white px-3 py-1 rounded-full text-sm font-bold`}>
          {statusConfig.text}
        </div>
        
        {/* DRAH Badge */}
        {isDRAH && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            DRAH
          </div>
        )}
      </div>
      
      {/* Property Information */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-3xl font-bold text-blue-600">{formattedPrice}</p>
        </div>
        
        <div className="mb-6">
          {environment === 'real_world' ? (
            <p className="text-gray-600">
              {location.address}, {location.city}, {location.state} {location.zipCode}
            </p>
          ) : (
            <p className="text-gray-600">
              {metaverseLocation.platform} - {metaverseLocation.district || 'District N/A'} - {metaverseLocation.coordinates}
              {metaverseLocation.url && (
                <a href={metaverseLocation.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">
                  View in Metaverse
                </a>
              )}
            </p>
          )}
        </div>
        
        {/* Property Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Property Type</p>
            <p className="font-semibold">{propertyTypeText}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Environment</p>
            <p className="font-semibold">{environment === 'real_world' ? 'Real World' : 'Metaverse'}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Size</p>
            <p className="font-semibold">{size} {sizeUnit}</p>
          </div>
          
          {environment === 'real_world' && propertyType === 'house' && (
            <>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Bedrooms</p>
                <p className="font-semibold">{bedrooms}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Bathrooms</p>
                <p className="font-semibold">{bathrooms}</p>
              </div>
            </>
          )}
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{description}</p>
        </div>
        
        {/* Features */}
        {features && features.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Features</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(showAllFeatures ? features : features.slice(0, 6)).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            {features.length > 6 && (
              <button
                onClick={() => setShowAllFeatures(!showAllFeatures)}
                className="mt-2 text-blue-600 hover:underline"
              >
                {showAllFeatures ? 'Show Less' : `Show All (${features.length})`}
              </button>
            )}
          </div>
        )}
        
        {/* DRAH Details */}
        {isDRAH && drahDetails && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">DRAH Program Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drahDetails.disasterType && (
                <div>
                  <p className="text-sm text-blue-700">Disaster Type</p>
                  <p className="font-semibold capitalize">{drahDetails.disasterType}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-blue-700">Affordable Housing Eligible</p>
                <p className="font-semibold">{drahDetails.affordableHousingEligible ? 'Yes' : 'No'}</p>
              </div>
              
              <div>
                <p className="text-sm text-blue-700">Construction Ready</p>
                <p className="font-semibold">{drahDetails.constructionReady ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/finance" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                DRAH Finance Options
              </Link>
              
              <Link to="/construction-services" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                AEC Construction Services
              </Link>
            </div>
          </div>
        )}
        
        {/* City Resources */}
        {environment === 'real_world' && cityResources && Object.values(cityResources).some(Boolean) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">City Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {cityResources.assessorUrl && (
                <a 
                  href={cityResources.assessorUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  City Assessor
                </a>
              )}
              
              {cityResources.taxDepartmentUrl && (
                <a 
                  href={cityResources.taxDepartmentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Tax Department
                </a>
              )}
              
              {cityResources.buildingPermitUrl && (
                <a 
                  href={cityResources.buildingPermitUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Building Permits
                </a>
              )}
              
              {cityResources.gisMapUrl && (
                <a 
                  href={cityResources.gisMapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GIS Maps
                </a>
              )}
              
              {cityResources.zoningUrl && (
                <a 
                  href={cityResources.zoningUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Zoning Information
                </a>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {status === 'available' && (
            <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Contact Agent
            </button>
          )}
          
          {status === 'auction' && (
            <Link to={`/auctions?property=${id}`} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              View Auction
            </Link>
          )}
          
          <button className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            Save Property
          </button>
          
          <button className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
