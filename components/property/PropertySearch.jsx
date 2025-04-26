import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PropertySearch component
 * Provides search functionality for properties
 */
const PropertySearch = ({ initialValues = {} }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    keyword: initialValues.keyword || '',
    location: initialValues.location || '',
    propertyType: initialValues.propertyType || '',
    minPrice: initialValues.minPrice || '',
    maxPrice: initialValues.maxPrice || '',
    environment: initialValues.environment || 'real_world',
    isDRAH: initialValues.isDRAH || false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build query string from search params
    const queryParams = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    // Navigate to search results page with query params
    navigate(`/properties?${queryParams.toString()}`);
  };

  return (
    <div className="property-search bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Your Property</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Keyword Search */}
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
              Keyword
            </label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              value={searchParams.keyword}
              onChange={handleChange}
              placeholder="Search by keyword"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={searchParams.location}
              onChange={handleChange}
              placeholder="City, State or Zip Code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Property Type */}
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={searchParams.propertyType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="vacant_lot">Vacant Lot</option>
              <option value="house">House</option>
              <option value="commercial">Commercial</option>
              <option value="metaverse_land">Metaverse Land</option>
              <option value="metaverse_building">Metaverse Building</option>
            </select>
          </div>
          
          {/* Price Range */}
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={searchParams.minPrice}
              onChange={handleChange}
              placeholder="Min Price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={searchParams.maxPrice}
              onChange={handleChange}
              placeholder="Max Price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Environment */}
          <div>
            <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-1">
              Environment
            </label>
            <select
              id="environment"
              name="environment"
              value={searchParams.environment}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="real_world">Real World</option>
              <option value="metaverse">Metaverse</option>
              <option value="">Both</option>
            </select>
          </div>
        </div>
        
        {/* DRAH Checkbox */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="isDRAH"
              checked={searchParams.isDRAH}
              onChange={handleChange}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="ml-2 text-sm text-gray-700">
              DRAH Properties Only (Disaster Recovery & Affordable Housing)
            </span>
          </label>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search Properties
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertySearch;
