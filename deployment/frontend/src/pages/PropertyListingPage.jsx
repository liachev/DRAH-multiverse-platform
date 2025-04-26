import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/property/PropertyCard';

const PropertyListingPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    propertyType: '',
    environment: '',
    minPrice: '',
    maxPrice: '',
    isDRAH: false,
    location: ''
  });

  // Mock data for demonstration
  const mockProperties = [
    {
      _id: '1',
      title: 'Modern Beachfront Villa',
      description: 'Luxurious beachfront property with stunning ocean views',
      price: 750000,
      location: {
        address: '123 Ocean Drive',
        city: 'Miami Beach',
        state: 'FL',
        zipCode: '33139'
      },
      propertyType: 'house',
      environment: 'real_world',
      images: [{ url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914', caption: 'Front view' }],
      bedrooms: 4,
      bathrooms: 3,
      size: 3200,
      sizeUnit: 'sqft',
      isDRAH: true,
      status: 'available'
    },
    {
      _id: '2',
      title: 'Downtown Luxury Apartment',
      description: 'Modern apartment in the heart of downtown',
      price: 450000,
      location: {
        address: '456 Main Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701'
      },
      propertyType: 'apartment',
      environment: 'real_world',
      images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', caption: 'Living room' }],
      bedrooms: 2,
      bathrooms: 2,
      size: 1200,
      sizeUnit: 'sqft',
      isDRAH: false,
      status: 'available'
    },
    {
      _id: '3',
      title: 'Decentraland Premium Plot',
      description: 'Prime location in Decentraland Fashion District',
      price: 25000,
      metaverseLocation: {
        platform: 'Decentraland',
        district: 'Fashion District',
        coordinates: 'X: 10, Y: 20',
        url: 'https://play.decentraland.org/?position=10,20'
      },
      propertyType: 'metaverse_land',
      environment: 'metaverse',
      images: [{ url: 'https://images.unsplash.com/photo-1558655146-d09347e92766', caption: 'Virtual plot' }],
      size: 16,
      sizeUnit: 'parcels',
      isDRAH: false,
      status: 'available'
    },
    {
      _id: '4',
      title: 'Suburban Family Home',
      description: 'Spacious family home in a quiet suburban neighborhood',
      price: 385000,
      location: {
        address: '789 Oak Street',
        city: 'Charlotte',
        state: 'NC',
        zipCode: '28205'
      },
      propertyType: 'house',
      environment: 'real_world',
      images: [{ url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994', caption: 'Front view' }],
      bedrooms: 3,
      bathrooms: 2.5,
      size: 2400,
      sizeUnit: 'sqft',
      isDRAH: true,
      status: 'available'
    },
    {
      _id: '5',
      title: 'Sandbox VIP Estate',
      description: 'Large estate in The Sandbox metaverse',
      price: 42000,
      metaverseLocation: {
        platform: 'The Sandbox',
        district: 'Central Hub',
        coordinates: '124, 78',
        url: 'https://www.sandbox.game/en/map/'
      },
      propertyType: 'metaverse_land',
      environment: 'metaverse',
      images: [{ url: 'https://images.unsplash.com/photo-1633265486064-086b219458ec', caption: 'Virtual estate' }],
      size: 24,
      sizeUnit: 'parcels',
      isDRAH: false,
      status: 'available'
    },
    {
      _id: '6',
      title: 'Mountain Retreat Cabin',
      description: 'Cozy cabin with breathtaking mountain views',
      price: 275000,
      location: {
        address: '101 Pine Ridge Road',
        city: 'Asheville',
        state: 'NC',
        zipCode: '28806'
      },
      propertyType: 'house',
      environment: 'real_world',
      images: [{ url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c', caption: 'Exterior view' }],
      bedrooms: 2,
      bathrooms: 1,
      size: 1100,
      sizeUnit: 'sqft',
      isDRAH: true,
      status: 'available'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

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
      let filteredProperties = [...mockProperties];
      
      if (filters.propertyType) {
        filteredProperties = filteredProperties.filter(p => p.propertyType === filters.propertyType);
      }
      
      if (filters.environment) {
        filteredProperties = filteredProperties.filter(p => p.environment === filters.environment);
      }
      
      if (filters.minPrice) {
        filteredProperties = filteredProperties.filter(p => p.price >= parseInt(filters.minPrice));
      }
      
      if (filters.maxPrice) {
        filteredProperties = filteredProperties.filter(p => p.price <= parseInt(filters.maxPrice));
      }
      
      if (filters.isDRAH) {
        filteredProperties = filteredProperties.filter(p => p.isDRAH);
      }
      
      if (filters.location) {
        const searchTerm = filters.location.toLowerCase();
        filteredProperties = filteredProperties.filter(p => {
          if (p.environment === 'real_world') {
            return (
              p.location.city.toLowerCase().includes(searchTerm) ||
              p.location.state.toLowerCase().includes(searchTerm) ||
              p.location.zipCode.includes(searchTerm)
            );
          } else if (p.environment === 'metaverse') {
            return (
              p.metaverseLocation.platform.toLowerCase().includes(searchTerm) ||
              p.metaverseLocation.district.toLowerCase().includes(searchTerm)
            );
          }
          return false;
        });
      }
      
      setProperties(filteredProperties);
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
      location: ''
    });
    
    // Reset to all properties
    setLoading(true);
    setTimeout(() => {
      setProperties(mockProperties);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Property Listings</h1>
      
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
            <label className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="City, State, Zip, or Platform"
              className="input-field"
            />
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
      
      {/* Property Listings */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <div key={property._id} className="transition duration-300 transform hover:-translate-y-1">
              <Link to={`/properties/${property._id}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
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
                    {property.environment === 'real_world' && (
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <span className="mr-4">{property.bedrooms} Beds</span>
                        <span className="mr-4">{property.bathrooms} Baths</span>
                        <span>{property.size} {property.sizeUnit}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold mt-4">No properties found</h3>
          <p className="text-gray-600 mt-2">Try adjusting your filters to find more properties.</p>
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

export default PropertyListingPage;
