import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Mock data for demonstration
  const mockProperties = [
    {
      _id: '1',
      title: 'Modern Beachfront Villa',
      description: 'Luxurious beachfront property with stunning ocean views. This spectacular villa features an open floor plan with floor-to-ceiling windows that showcase panoramic ocean views. The gourmet kitchen includes top-of-the-line appliances and a large island perfect for entertaining. The master suite offers a private balcony, walk-in closet, and spa-like bathroom. Additional features include a private pool, outdoor kitchen, and direct beach access.',
      price: 750000,
      location: {
        address: '123 Ocean Drive',
        city: 'Miami Beach',
        state: 'FL',
        zipCode: '33139'
      },
      propertyType: 'house',
      environment: 'real_world',
      images: [
        { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914', caption: 'Front view' },
        { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', caption: 'Pool area' },
        { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', caption: 'Living room' }
      ],
      bedrooms: 4,
      bathrooms: 3,
      size: 3200,
      sizeUnit: 'sqft',
      isDRAH: true,
      status: 'available',
      features: [
        'Beachfront',
        'Private Pool',
        'Outdoor Kitchen',
        'Smart Home Technology',
        'Hurricane Resistant Windows',
        'Solar Panels',
        'EV Charging Station'
      ],
      drahDetails: {
        disasterType: 'hurricane',
        affordableHousingEligible: true,
        constructionReady: true
      }
    },
    {
      _id: '2',
      title: 'Downtown Luxury Apartment',
      description: 'Modern apartment in the heart of downtown. This stylish apartment offers urban living at its finest with high ceilings, hardwood floors, and an open concept layout. The chef\'s kitchen features stainless steel appliances and quartz countertops. Floor-to-ceiling windows provide abundant natural light and city views. Building amenities include a rooftop pool, fitness center, and 24-hour concierge service.',
      price: 450000,
      location: {
        address: '456 Main Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701'
      },
      propertyType: 'apartment',
      environment: 'real_world',
      images: [
        { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', caption: 'Living room' },
        { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', caption: 'Kitchen' },
        { url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d', caption: 'Bedroom' }
      ],
      bedrooms: 2,
      bathrooms: 2,
      size: 1200,
      sizeUnit: 'sqft',
      isDRAH: false,
      status: 'available',
      features: [
        'City Views',
        'Hardwood Floors',
        'Stainless Steel Appliances',
        'Quartz Countertops',
        'Building Fitness Center',
        'Rooftop Pool',
        '24-hour Concierge'
      ]
    },
    {
      _id: '3',
      title: 'Decentraland Premium Plot',
      description: 'Prime location in Decentraland Fashion District. This premium virtual land parcel is situated in one of the most desirable areas of Decentraland. The location offers high foot traffic and visibility, making it perfect for retail, galleries, or entertainment venues. The plot comes with basic development rights and can be customized with various structures and interactive elements.',
      price: 25000,
      metaverseLocation: {
        platform: 'Decentraland',
        district: 'Fashion District',
        coordinates: 'X: 10, Y: 20',
        url: 'https://play.decentraland.org/?position=10,20'
      },
      propertyType: 'metaverse_land',
      environment: 'metaverse',
      images: [
        { url: 'https://images.unsplash.com/photo-1558655146-d09347e92766', caption: 'Virtual plot' },
        { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e', caption: 'District overview' },
        { url: 'https://images.unsplash.com/photo-1633265486064-086b219458ec', caption: 'Nearby attractions' }
      ],
      size: 16,
      sizeUnit: 'parcels',
      isDRAH: false,
      status: 'available',
      features: [
        'Premium Location',
        'High Foot Traffic',
        'Development Rights',
        'Customizable',
        'Near Virtual Attractions',
        'Suitable for Commercial Use'
      ],
      metaverseDetails: {
        trafficScore: 85,
        developmentLevel: 'Medium',
        neighboringBrands: ['Virtual Fashion House', 'Digital Art Gallery']
      }
    },
    {
      _id: '4',
      title: 'Suburban Family Home',
      description: 'Spacious family home in a quiet suburban neighborhood. This charming home offers the perfect blend of comfort and functionality. The main level features a welcoming living room, formal dining room, and updated kitchen that opens to a family room. Upstairs you\'ll find three bedrooms including a master suite with a walk-in closet and en-suite bathroom. The fenced backyard includes a covered patio and mature landscaping.',
      price: 385000,
      location: {
        address: '789 Oak Street',
        city: 'Charlotte',
        state: 'NC',
        zipCode: '28205'
      },
      propertyType: 'house',
      environment: 'real_world',
      images: [
        { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994', caption: 'Front view' },
        { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858', caption: 'Kitchen' },
        { url: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab', caption: 'Backyard' }
      ],
      bedrooms: 3,
      bathrooms: 2.5,
      size: 2400,
      sizeUnit: 'sqft',
      isDRAH: true,
      status: 'available',
      features: [
        'Updated Kitchen',
        'Master Suite',
        'Fenced Backyard',
        'Covered Patio',
        'Two-Car Garage',
        'Energy Efficient Appliances',
        'Storm Shelter'
      ],
      drahDetails: {
        disasterType: 'tornado',
        affordableHousingEligible: true,
        constructionReady: false
      }
    },
    {
      _id: '5',
      title: 'Sandbox VIP Estate',
      description: 'Large estate in The Sandbox metaverse. This premium virtual estate offers extensive space for development in The Sandbox metaverse. The property includes multiple connected parcels, providing ample room for complex builds and experiences. Located near central attractions, this estate benefits from established traffic patterns and visibility. Ideal for businesses, entertainment venues, or ambitious creative projects.',
      price: 42000,
      metaverseLocation: {
        platform: 'The Sandbox',
        district: 'Central Hub',
        coordinates: '124, 78',
        url: 'https://www.sandbox.game/en/map/'
      },
      propertyType: 'metaverse_land',
      environment: 'metaverse',
      images: [
        { url: 'https://images.unsplash.com/photo-1633265486064-086b219458ec', caption: 'Virtual estate' },
        { url: 'https://images.unsplash.com/photo-1620794108219-aedbaded4eea', caption: 'Aerial view' },
        { url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6', caption: 'Development potential' }
      ],
      size: 24,
      sizeUnit: 'parcels',
      isDRAH: false,
      status: 'available',
      features: [
        'Large Connected Parcels',
        'Central Location',
        'High Visibility',
        'Development Flexibility',
        'Proximity to Major Attractions',
        'Suitable for Complex Builds'
      ],
      metaverseDetails: {
        trafficScore: 92,
        developmentLevel: 'Low',
        neighboringBrands: ['Gaming Guild', 'Virtual Concert Venue', 'NFT Museum']
      }
    },
    {
      _id: '6',
      title: 'Mountain Retreat Cabin',
      description: 'Cozy cabin with breathtaking mountain views. This rustic yet refined cabin offers a peaceful retreat surrounded by nature. The open concept main living area features vaulted ceilings, a stone fireplace, and large windows that frame the mountain views. The well-appointed kitchen includes custom cabinetry and a breakfast bar. A wraparound deck provides the perfect spot to enjoy the scenery and wildlife. The property includes 2 acres of wooded land.',
      price: 275000,
      location: {
        address: '101 Pine Ridge Road',
        city: 'Asheville',
        state: 'NC',
        zipCode: '28806'
      },
      propertyType: 'house',
      environment: 'real_world',
      images: [
        { url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c', caption: 'Exterior view' },
        { url: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e', caption: 'Living room' },
        { url: 'https://images.unsplash.com/photo-1596276020587-8044fe049813', caption: 'Mountain view' }
      ],
      bedrooms: 2,
      bathrooms: 1,
      size: 1100,
      sizeUnit: 'sqft',
      isDRAH: true,
      status: 'available',
      features: [
        'Mountain Views',
        'Stone Fireplace',
        'Wraparound Deck',
        'Custom Kitchen',
        '2 Acres of Land',
        'Flood Resistant Foundation',
        'Reinforced Roof'
      ],
      drahDetails: {
        disasterType: 'flood',
        affordableHousingEligible: true,
        constructionReady: true
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundProperty = mockProperties.find(p => p._id === id);
      setProperty(foundProperty || null);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
        <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link to="/properties" className="btn-primary">
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/properties" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Properties
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Property Images */}
        <div className="relative">
          <div className="h-96 bg-gray-200">
            {property.images && property.images.length > 0 && (
              <img 
                src={property.images[activeImage].url} 
                alt={property.images[activeImage].caption || property.title} 
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Image Navigation */}
            {property.images && property.images.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImage((activeImage - 1 + property.images.length) % property.images.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setActiveImage((activeImage + 1) % property.images.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Status Badges */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              {property.isDRAH && (
                <div className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md">
                  DRAH Eligible
                </div>
              )}
              {property.environment === 'metaverse' && (
                <div className="bg-purple-500 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md">
                  Metaverse
                </div>
              )}
              <div className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md">
                {property.status === 'available' ? 'Available' : property.status}
              </div>
            </div>
          </div>
          
          {/* Thumbnail Navigation */}
          {property.images && property.images.length > 1 && (
            <div className="flex overflow-x-auto py-4 px-4 space-x-2 bg-gray-100">
              {property.images.map((image, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`h-20 w-32 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${activeImage === index ? 'border-blue-500' : 'border-transparent'}`}
                >
                  <img 
                    src={image.url} 
                    alt={image.caption || `Image ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Property Details */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
              <p className="text-gray-600 text-lg">
                {property.environment === 'real_world' ? (
                  <span>{property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}</span>
                ) : (
                  <span>{property.metaverseLocation.platform} - {property.metaverseLocation.district} ({property.metaverseLocation.coordinates})</span>
                )}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-600">${property.price.toLocaleString()}</div>
              <div className="text-gray-500 mt-1">
                {property.size} {property.sizeUnit}
              </div>
            </div>
          </div>
          
          {/* Property Specs */}
          {property.environment === 'real_world' && (
            <div className="flex flex-wrap gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Property Type</div>
                  <div className="font-semibold capitalize">{property.propertyType.replace('_', ' ')}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                  <div className="font-semibold">{property.bedrooms}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                  <div className="font-semibold">{property.bathrooms}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Size</div>
                  <div className="font-semibold">{property.size} {property.sizeUnit}</div>
                </div>
              </div>
            </div>
          )}
          
          {property.environment === 'metaverse' && (
            <div className="flex flex-wrap gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Platform</div>
                  <div className="font-semibold">{property.metaverseLocation.platform}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">District</div>
                  <div className="font-semibold">{property.metaverseLocation.district}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Size</div>
                  <div className="font-semibold">{property.size} {property.sizeUnit}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Traffic Score</div>
                  <div className="font-semibold">{property.metaverseDetails?.trafficScore || 'N/A'}</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>
          
          {/* Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.features && property.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* DRAH Details */}
          {property.isDRAH && property.drahDetails && (
            <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">DRAH Program Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Disaster Resistance</h3>
                  <p className="text-gray-700">
                    This property is designed to resist {property.drahDetails.disasterType} damage and meets all DRAH program requirements.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Affordable Housing</h3>
                  <p className="text-gray-700">
                    {property.drahDetails.affordableHousingEligible 
                      ? 'This property qualifies for affordable housing programs under DRAH guidelines.' 
                      : 'This property does not currently qualify for affordable housing programs.'}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Construction Status</h3>
                  <p className="text-gray-700">
                    {property.drahDetails.constructionReady 
                      ? 'This property is construction-ready with approved plans and permits.' 
                      : 'This property requires additional approvals before construction can begin.'}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">DRAH Financing</h3>
                  <p className="text-gray-700">
                    Eligible for special financing with no PMI, no down payment, and minimum FICO score of 500.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link to="/finance" className="btn-primary">
                  Learn More About DRAH Finance
                </Link>
              </div>
            </div>
          )}
          
          {/* Metaverse Details */}
          {property.environment === 'metaverse' && property.metaverseDetails && (
            <div className="mb-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Metaverse Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Traffic Score</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-purple-600 h-4 rounded-full" 
                      style={{ width: `${property.metaverseDetails.trafficScore}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-700 mt-2">
                    This location has a traffic score of {property.metaverseDetails.trafficScore}/100, indicating {property.metaverseDetails.trafficScore > 80 ? 'very high' : property.metaverseDetails.trafficScore > 60 ? 'high' : property.metaverseDetails.trafficScore > 40 ? 'moderate' : 'low'} visitor activity.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Development Level</h3>
                  <p className="text-gray-700">
                    Current development level: <span className="font-semibold">{property.metaverseDetails.developmentLevel}</span>
                  </p>
                  <p className="text-gray-700 mt-2">
                    {property.metaverseDetails.developmentLevel === 'Low' 
                      ? 'This property has minimal existing development, offering maximum creative freedom.' 
                      : property.metaverseDetails.developmentLevel === 'Medium'
                      ? 'This property has some basic development in place that can be built upon or modified.'
                      : 'This property is highly developed with sophisticated structures and features.'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">Neighboring Brands & Attractions</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.metaverseDetails.neighboringBrands.map((brand, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <a 
                  href={property.metaverseLocation.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                >
                  Visit in Metaverse
                </a>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={`/auctions?property=${property._id}`} className="btn-primary text-center">
              View in Auction
            </Link>
            <Link to="/finance" className="btn-secondary text-center">
              Calculate Financing
            </Link>
            {property.environment === 'real_world' && (
              <Link to="/construction" className="btn-secondary text-center">
                Construction Options
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
