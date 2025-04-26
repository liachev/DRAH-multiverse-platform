import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    // Simulate API fetch for property details
    setTimeout(() => {
      // Mock data - would be fetched from API in production
      const propertyData = {
        id: parseInt(id),
        title: id === '1' ? 'Vacant Lot in St. Bernard Parish' : 
               id === '2' ? 'Corner Lot in Chalmette' : 
               id === '3' ? 'Waterfront Lot in Violet' : 
               `Property ${id}`,
        price: id === '1' ? 45000 : 
               id === '2' ? 52500 : 
               id === '3' ? 68000 : 
               50000,
        location: id === '1' ? 'St. Bernard Parish, LA 70032' : 
                  id === '2' ? 'Chalmette, LA 70043' : 
                  id === '3' ? 'Violet, LA 70092' : 
                  'Louisiana',
        size: id === '1' ? '0.25 acres' : 
              id === '2' ? '0.33 acres' : 
              id === '3' ? '0.5 acres' : 
              '0.3 acres',
        type: 'Vacant Lot',
        zoning: 'Residential',
        isDRAH: true,
        description: `This ${id === '1' ? '0.25' : id === '2' ? '0.33' : id === '3' ? '0.5' : '0.3'} acre vacant lot is perfect for building your dream home. Located in a desirable area with easy access to amenities and transportation. The lot is cleared and ready for construction. This property is part of the DRAH initiative for disaster recovery and affordable housing.`,
        features: [
          'Cleared and ready for construction',
          'Utilities available at street',
          'No HOA restrictions',
          'Flood zone X (minimal flood risk)',
          'Close to schools and shopping',
          'Public transportation nearby'
        ],
        images: [
          id === '1' ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80' :
          id === '2' ? 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80' :
          id === '3' ? 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80' :
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80',
          'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=996&q=80',
          'https://images.unsplash.com/photo-1543965860-0a2c7d5a333d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80'
        ],
        cityResources: [
          { name: 'City Assessor', url: '#' },
          { name: 'Tax Department', url: '#' },
          { name: 'Building Permits', url: '#' },
          { name: 'GIS Maps', url: '#' },
          { name: 'Zoning Information', url: '#' }
        ],
        auctionStatus: 'upcoming',
        auctionDate: '2025-05-15T10:00:00',
        depositAmount: 850,
        similarProperties: [4, 5, 6]
      };
      
      setProperty(propertyData);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/properties" className="btn btn-primary">Back to Properties</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <svg className="h-4 w-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="flex items-center">
              <Link to="/properties" className="hover:text-blue-600">Properties</Link>
              <svg className="h-4 w-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-700">{property.title}</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Property Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <p className="text-gray-600 mb-2">{property.location}</p>
            {property.isDRAH && (
              <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                DRAH Property
              </span>
            )}
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-3xl font-bold text-blue-600">${property.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Property Images */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <img 
              src={property.images[0]} 
              alt={property.title} 
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <img 
              src={property.images[1]} 
              alt={property.title} 
              className="w-full h-44 object-cover rounded-lg"
            />
            <img 
              src={property.images[2]} 
              alt={property.title} 
              className="w-full h-44 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Property Details
            </button>
            <button
              onClick={() => setActiveTab('auction')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'auction'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Auction Information
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'resources'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              City Resources
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              DRAH Services
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-12">
        {/* Property Details Tab */}
        {activeTab === 'details' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 mb-6">{property.description}</p>
                
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property ID:</span>
                      <span className="font-medium">{property.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium">{property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{property.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zoning:</span>
                      <span className="font-medium">{property.zoning}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">DRAH Property:</span>
                      <span className="font-medium">{property.isDRAH ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Interested in this property?</h3>
                  <p className="text-gray-700 mb-4">Contact us to learn more about this property or to schedule a visit.</p>
                  <Link to="/contact" className="btn btn-primary w-full">Contact Us</Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Auction Tab */}
        {activeTab === 'auction' && (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold mb-6">Auction Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold mb-2">Auction Status</h3>
                  <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                    Upcoming
                  </span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold mb-2">Auction Date</h3>
                  <p className="font-medium">May 15, 2025</p>
                  <p className="text-gray-600">10:00 AM CST</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-semibold mb-2">Required Deposit</h3>
                  <p className="font-medium text-blue-600">${property.depositAmount}</p>
                  <p className="text-gray-600">Refundable</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Three-Step Auction Process</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Select Property</h4>
                  <p className="text-gray-600">Browse available properties and select the ones you're interested in.</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Place Deposit</h4>
                  <p className="text-gray-600">Place a refundable $850 deposit to participate in the auction.</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Win Auction</h4>
                  <p className="text-gray-600">If you win, complete payment within 24 hours to secure the property.</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Link to="/auctions" className="btn btn-primary px-8 py-3">View All Auctions</Link>
              </div>
            </div>
          </div>
        )}
        
        {/* City Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">City Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {property.cityResources.map((resource, index) => (
                <a 
                  key={index}
                  href={resource.url}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-
(Content truncated due to size limit. Use line ranges to read in chunks)