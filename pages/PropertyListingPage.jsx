import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PropertyListingPage = () => {
  // Mock data for properties - would be fetched from API in production
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    location: '',
    priceMin: '',
    priceMax: '',
    type: 'all'
  });

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setProperties([
        {
          id: 1,
          title: 'Vacant Lot in St. Bernard Parish',
          price: 45000,
          location: 'St. Bernard Parish, LA 70032',
          size: '0.25 acres',
          type: 'Vacant Lot',
          zoning: 'Residential',
          isDRAH: true,
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
        },
        {
          id: 2,
          title: 'Corner Lot in Chalmette',
          price: 52500,
          location: 'Chalmette, LA 70043',
          size: '0.33 acres',
          type: 'Vacant Lot',
          zoning: 'Residential',
          isDRAH: true,
          image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
        },
        {
          id: 3,
          title: 'Waterfront Lot in Violet',
          price: 68000,
          location: 'Violet, LA 70092',
          size: '0.5 acres',
          type: 'Vacant Lot',
          zoning: 'Residential',
          isDRAH: true,
          image: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
        },
        {
          id: 4,
          title: 'Residential Lot in Meraux',
          price: 49500,
          location: 'Meraux, LA 70075',
          size: '0.28 acres',
          type: 'Vacant Lot',
          zoning: 'Residential',
          isDRAH: true,
          image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80'
        },
        {
          id: 5,
          title: 'Commercial Lot in St. Bernard',
          price: 85000,
          location: 'St. Bernard, LA 70085',
          size: '0.75 acres',
          type: 'Vacant Lot',
          zoning: 'Commercial',
          isDRAH: true,
          image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=996&q=80'
        },
        {
          id: 6,
          title: 'Residential Lot with Utilities',
          price: 59000,
          location: 'Chalmette, LA 70043',
          size: '0.3 acres',
          type: 'Vacant Lot',
          zoning: 'Residential',
          isDRAH: true,
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

  const filteredProperties = properties.filter(property => {
    // Filter by location
    if (filter.location && !property.location.toLowerCase().includes(filter.location.toLowerCase())) {
      return false;
    }
    
    // Filter by min price
    if (filter.priceMin && property.price < parseInt(filter.priceMin)) {
      return false;
    }
    
    // Filter by max price
    if (filter.priceMax && property.price > parseInt(filter.priceMax)) {
      return false;
    }
    
    // Filter by type
    if (filter.type !== 'all' && property.type !== filter.type) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Property Listings</h1>
        
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <label className="block text-gray-700 mb-2">Property Type</label>
              <select
                name="type"
                value={filter.type}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="Vacant Lot">Vacant Lot</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">{filteredProperties.length} properties found</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map(property => (
                <div key={property.id} className="property-card">
                  <div className="relative">
                    {property.isDRAH && (
                      <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
                        DRAH
                      </div>
                    )}
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="property-image"
                    />
                  </div>
                  <div className="property-content">
                    <h3 className="property-title">{property.title}</h3>
                    <p className="property-price">${property.price.toLocaleString()}</p>
                    <p className="property-location">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {property.location}
                    </p>
                    <div className="property-features">
                      <div className="property-feature">
                        <span className="block text-gray-500 text-sm">Size</span>
                        <span className="font-medium">{property.size}</span>
                      </div>
                      <div className="property-feature">
                        <span className="block text-gray-500 text-sm">Type</span>
                        <span className="font-medium">{property.type}</span>
                      </div>
                      <div className="property-feature">
                        <span className="block text-gray-500 text-sm">Zoning</span>
                        <span className="font-medium">{property.zoning}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link to={`/properties/${property.id}`} className="btn btn-primary w-full text-center">View Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredProperties.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to find more properties.</p>
                <button 
                  onClick={() => setFilter({
                    location: '',
                    priceMin: '',
                    priceMax: '',
                    type: 'all'
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

export default PropertyListingPage;
