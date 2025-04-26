import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Multiverse Platform Portal Exchange</h1>
            <p className="text-xl mb-8">Connecting real estate and business solutions in one comprehensive platform</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/properties" className="btn bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium">
                Browse Properties
              </Link>
              <Link to="/business-solutions" className="btn bg-transparent border-2 border-white hover:bg-white hover:text-blue-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Business Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Property Card 1 */}
            <div className="property-card">
              <div className="relative">
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
                  DRAH
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
                  alt="Property" 
                  className="property-image"
                />
              </div>
              <div className="property-content">
                <h3 className="property-title">Vacant Lot in St. Bernard Parish</h3>
                <p className="property-price">$45,000</p>
                <p className="property-location">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  St. Bernard Parish, LA 70032
                </p>
                <div className="property-features">
                  <div className="property-feature">
                    <span className="block text-gray-500 text-sm">Size</span>
                    <span className="font-medium">0.25 acres</span>
                  </div>
                  <div className="property-feature">
                    <span className="block text-gray-500 text-sm">Type</span>
                    <span className="font-medium">Vacant Lot</span>
                  </div>
                  <div className="property-feature">
                    <span className="block text-gray-500 text-sm">Zoning</span>
                    <span className="font-medium">Residential</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/properties/1" className="btn btn-primary w-full text-center">View Details</Link>
                </div>
              </div>
            </div>

            {/* Property Card 2 */}
            <div className="property-card">
              <div className="relative">
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
                  DRAH
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
                  alt="Property" 
                  className="property-image"
                />
              </div>
              <div className="property-content">
                <h3 className="property-title">Corner Lot in Chalmette</h3>
                <p className="property-price">$52,500</p>
                <p className="property-location">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Chalmette, LA 70043
                </p>
                <div className="property-features">
                  <div className="property-feature">
                    <span className="block text-gray-500 text-sm">Size</span>
                    <span className="font-medium">0.33 acres</span>
                  </div>
                  <div className="property-feature">
                    <span className="block text-gray-500 text-sm">Type</span>
                    <span className="font-medium">Vacant Lot</span>
                  </div>
                  <div className="property-feature">
                    <span className="block text-gray-500 text-sm">Zoning</span>
                    <span className="font-medium">Residential</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/properties/2" className="btn btn-primary w-full text-center">View Details</Link>
                </div>
              </div>
            </div>

            {/* Property Card 3 */}
            <div className="property-card">
              <div className="relative">
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
                  DRAH
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
                  alt="Property" 
                  className="property-image"
                />
              </div>
              <div className="property-content">
                <h3 className="property-title">Waterfront Lot in Violet</h3>
                <p className="property-price">$68,000</p>
                <p className="property-location">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Violet, LA 70092
                </p>
                <div className="property-features">
                  <div className="property-feature">
                    <span className="block text-gray-500 text-sm">Size</span>
                    <span className="font-medium">0.5 acres</span>
                  </div>
                  <div className="property-feature">
                    <span className="block text-gray-500 text-sm">Type</span>
                    <span className="font-medium">Vacant Lot</span>
                  </div>
                  <div className="property-feature">
                    <span className="block text-gray-500 text-sm">Zoning</span>
                    <span className="font-medium">Residential</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/properties/3" className="btn btn-primary w-full text-center">View Details</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link to="/properties" className="btn btn-secondary px-8 py-3">View All Properties</Link>
          </div>
        </div>
      </section>

      {/* DRAH Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">DRAH Services</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Comprehensive solutions for disaster recovery and affordable housing initiatives
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Finance Service */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">DRAH Finance</h3>
              <p className="text-gray-600 text-center mb-4">
                Alternative mortgage solutions with minimum FICO score of 500, no PMI, and no down payment options.
              </p>
              <div className="text-center">
                <Link to="/finance" className="text-blue-600 hover:text-blue-800 font-medium">Learn More →</Link>
              </div>
            </div>
            
            {/* Construction Service */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">AEC DRAH Construction</h3>
              <p className="text-gray-600 text-center mb-4">
                Design and build houses on purchased lots with up to 10% savings compared to market prices.
              </p>
              <div className="text-center">
                <Link to="/construction-services" className="text-blue-600 hover:text-blue-800 font-medium">Learn More →</Link>
              </div>
            </div>
            
            {/* Auction Service */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Property Auctions</h3>
              <p className="text-gray-600 text-center mb-4">
                Participate in our three-step auction process to purchase properties with transparent bidding.
              </p>
              <div className="text-center">
                <Link to="/auctions" className="text-blue-600 hover:text-blue-800 font-medium">Learn More →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Solutions Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Business Solutions</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            AI-driven business modeling and resources for entrepreneurs
          </p>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
                  alt="Business Solutions" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <h3 className="text-2xl font-bold mb-4">Launch Your Business with Minimal Capital</h3>
                <p className="text-gray-600 mb-6">
                  Our platform provides AI-driven business modeling tools inspired by Warren Buffett's investment principles, helping entrepreneurs start and scale ventures with minimal capital.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Business models for novice entrepreneurs</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI-powered business toolkit</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Step-by-step process for launching businesses</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Success stories from entrepreneurs using the platform</span>
                  </li>
                </ul>
                <Link to="/business-solutions" className="btn btn-primary">Explore Business Solutions</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're looking for property, financing, construction ser
(Content truncated due to size limit. Use line ranges to read in chunks)