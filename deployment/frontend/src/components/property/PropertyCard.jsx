import React from 'react';

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 transform hover:-translate-y-1">
      <div className="h-48 bg-gray-200 relative">
        {property.images && property.images[0] && (
          <img 
            src={property.images[0].url} 
            alt={property.images[0].caption || property.title} 
            className="w-full h-full object-cover"
          />
        )}
        {property.isDRAH && (
          <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-semibold">
            DRAH Eligible
          </div>
        )}
        {property.environment === 'metaverse' && (
          <div className="absolute top-0 left-0 bg-purple-500 text-white px-3 py-1 text-sm font-semibold">
            Metaverse
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{property.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">${property.price.toLocaleString()}</span>
          <div className="text-sm text-gray-500">
            {property.environment === 'real_world' ? (
              <span>{property.location.city}, {property.location.state}</span>
            ) : (
              <span>{property.metaverseLocation.platform}</span>
            )}
          </div>
        </div>
        {property.environment === 'real_world' && property.bedrooms && (
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <span className="mr-4">{property.bedrooms} Beds</span>
            <span className="mr-4">{property.bathrooms} Baths</span>
            <span>{property.size} {property.sizeUnit}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
