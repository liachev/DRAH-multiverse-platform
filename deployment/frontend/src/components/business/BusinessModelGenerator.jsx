import React, { useState } from 'react';

/**
 * BusinessModelGenerator component
 * AI-driven business modeling tool based on Warren Buffett principles
 */
const BusinessModelGenerator = () => {
  const [businessType, setBusinessType] = useState('micro_saas');
  const [capitalRequired, setCapitalRequired] = useState(5000);
  const [isHumanitarian, setIsHumanitarian] = useState(false);
  const [stage, setStage] = useState('ideation');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Business type options
  const businessTypes = [
    { 
      id: 'micro_saas', 
      name: 'Micro-SaaS', 
      description: 'Small, focused software as a service businesses with low overhead and high margins.',
      capitalRange: '$3,000 - $10,000',
      timeToMarket: '3-6 months',
      scalability: 'High',
      icon: '💻'
    },
    { 
      id: 'digital_content', 
      name: 'Digital Content Creation', 
      description: 'Creating and monetizing digital content through various platforms and channels.',
      capitalRange: '$1,000 - $5,000',
      timeToMarket: '1-3 months',
      scalability: 'Medium',
      icon: '🎨'
    },
    { 
      id: 'sustainable_marketplace', 
      name: 'Sustainable Marketplace', 
      description: 'Online marketplace connecting eco-friendly products with conscious consumers.',
      capitalRange: '$5,000 - $15,000',
      timeToMarket: '4-8 months',
      scalability: 'High',
      icon: '🌱'
    },
    { 
      id: 'service_business', 
      name: 'Service Business', 
      description: 'Providing specialized services to businesses or consumers with minimal startup costs.',
      capitalRange: '$2,000 - $8,000',
      timeToMarket: '1-2 months',
      scalability: 'Medium',
      icon: '🛠️'
    },
    { 
      id: 'ecommerce', 
      name: 'E-Commerce', 
      description: 'Selling physical or digital products online with dropshipping or minimal inventory.',
      capitalRange: '$3,000 - $12,000',
      timeToMarket: '2-4 months',
      scalability: 'Medium-High',
      icon: '🛒'
    }
  ];
  
  // Get current business type details
  const currentBusinessType = businessTypes.find(type => type.id === businessType);
  
  // AI recommendations based on business type
  const getAIRecommendations = () => {
    const recommendations = {
      datafication: {
        micro_saas: 'Implement analytics to track user engagement and feature usage patterns.',
        digital_content: 'Use content performance metrics to guide future content creation.',
        sustainable_marketplace: 'Collect and analyze sustainability metrics for all products.',
        service_business: 'Track client satisfaction and service delivery metrics.',
        ecommerce: 'Analyze purchase patterns and customer behavior for inventory optimization.'
      },
      algorithm: {
        micro_saas: 'Develop recommendation algorithms to suggest features based on user behavior.',
        digital_content: 'Create content recommendation systems to increase engagement.',
        sustainable_marketplace: 'Build matching algorithms to connect consumers with ideal products.',
        service_business: 'Implement scheduling and resource allocation algorithms.',
        ecommerce: 'Develop personalized product recommendation engines.'
      },
      automation: {
        micro_saas: 'Automate onboarding, billing, and customer support processes.',
        digital_content: 'Set up automated content distribution across multiple platforms.',
        sustainable_marketplace: 'Automate seller verification and product sustainability scoring.',
        service_business: 'Create automated booking, follow-up, and feedback systems.',
        ecommerce: 'Implement automated inventory management and order fulfillment.'
      },
      innovation: {
        micro_saas: 'Focus on solving one specific problem exceptionally well.',
        digital_content: 'Experiment with emerging content formats and platforms.',
        sustainable_marketplace: 'Develop innovative sustainability verification methods.',
        service_business: 'Create proprietary service delivery methodologies.',
        ecommerce: 'Explore unique product bundling or subscription models.'
      }
    };
    
    return {
      datafication: recommendations.datafication[businessType],
      algorithm: recommendations.algorithm[businessType],
      automation: recommendations.automation[businessType],
      innovation: recommendations.innovation[businessType]
    };
  };
  
  // Buffett principles applied to selected business
  const buffettPrinciples = {
    valueInvesting: {
      title: 'Value Investing',
      description: 'Focus on businesses with intrinsic value that can generate consistent cash flow.',
      application: {
        micro_saas: 'Target niche markets with specific needs willing to pay for solutions.',
        digital_content: 'Create evergreen content that continues to generate value over time.',
        sustainable_marketplace: 'Focus on quality, sustainable products with lasting appeal.',
        service_business: 'Develop expertise in high-value services with recurring revenue potential.',
        ecommerce: 'Select products with strong margins and lasting customer appeal.'
      }
    },
    longTermFocus: {
      title: 'Long-Term Focus',
      description: 'Build for the long-term rather than seeking quick profits.',
      application: {
        micro_saas: 'Prioritize customer retention and lifetime value over rapid acquisition.',
        digital_content: 'Build a loyal audience base rather than chasing viral trends.',
        sustainable_marketplace: 'Establish trust and reputation in the sustainability space.',
        service_business: 'Focus on client relationships and repeat business.',
        ecommerce: 'Build a brand that stands for quality and customer satisfaction.'
      }
    },
    qualityOverQuantity: {
      title: 'Quality Over Quantity',
      description: 'Invest in fewer, higher-quality opportunities rather than diversifying too broadly.',
      application: {
        micro_saas: 'Master one core feature set before expanding to others.',
        digital_content: 'Create fewer, higher-quality pieces rather than high volume.',
        sustainable_marketplace: 'Curate products carefully rather than maximizing listings.',
        service_business: 'Specialize in a few services you can deliver exceptionally well.',
        ecommerce: 'Offer a carefully selected product range rather than endless options.'
      }
    }
  };
  
  // Milestones based on business stage
  const getMilestones = () => {
    const milestonesByStage = {
      ideation: [
        { title: 'Market Research', description: 'Validate market need and identify target customers' },
        { title: 'Competitive Analysis', description: 'Analyze existing solutions and identify gaps' },
        { title: 'Value Proposition', description: 'Define unique value proposition and differentiators' },
        { title: 'Business Model Canvas', description: 'Create initial business model canvas' }
      ],
      validation: [
        { title: 'Minimum Viable Product', description: 'Develop MVP to test core assumptions' },
        { title: 'Customer Interviews', description: 'Conduct interviews with potential customers' },
        { title: 'Landing Page', description: 'Create landing page to gauge interest' },
        { title: 'Pricing Strategy', description: 'Test different pricing models' }
      ],
      development: [
        { title: 'Product Development', description: 'Build full version of product or service' },
        { title: 'Operations Setup', description: 'Establish operational processes and tools' },
        { title: 'Legal Structure', description: 'Set up legal entity and necessary agreements' },
        { title: 'Financial Planning', description: 'Create detailed financial projections' }
      ],
      launch: [
        { title: 'Marketing Plan', description: 'Develop marketing strategy and launch campaign' },
        { title: 'Customer Acquisition', description: 'Implement initial customer acquisition channels' },
        { title: 'Feedback Loop', description: 'Establish system for collecting customer feedback' },
        { title: 'Support System', description: 'Set up customer support processes' }
      ],
      growth: [
        { title: 'Scaling Operations', description: 'Optimize processes for handling increased volume' },
        { title: 'Team Expansion', description: 'Hire key roles to support growth' },
        { title: 'Marketing Optimization', description: 'Refine marketing channels based on performance' },
        { title: 'Product Iteration', description: 'Enhance product based on customer feedback' }
      ]
    };
    
    return milestonesByStage[stage] || milestonesByStage.ideation;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // This would be implemented in step 005 when we create the backend functions
    console.log('Saving business model');
  };
  
  // Get AI recommendations
  const recommendations = getAIRecommendations();
  
  // Get milestones
  const milestones = getMilestones();
  
  return (
    <div className="business-model-generator bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">AI-Driven Business Modeling</h2>
        <p className="text-indigo-100">
          Create a scalable business model with minimal capital using Warren Buffett's investment principles.
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Business Type Selection */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Business Type</h3>
            
            <div className="space-y-3">
              {businessTypes.map(type => (
                <div 
                  key={type.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    businessType === type.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-200'
                  }`}
                  onClick={() => setBusinessType(type.id)}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{type.icon}</span>
                    <div>
                      <h4 className="font-medium">{type.name}</h4>
                      <p className="text-sm text-gray-500">{type.capitalRange} startup</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ideation">Ideation</option>
                <option value="validation">Validation</option>
                <option value="development">Development</option>
                <option value="launch">Launch</option>
                <option value="growth">Growth</option>
              </select>
            </div>
            
            <div className="mt-4">
              <label htmlFor="capitalRequired" className="block text-sm font-medium text-gray-700 mb-1">
                Starting Capital: ${capitalRequired.toLocaleString()}
              </label>
              <input
                type="range"
                id="capitalRequired"
                min="1000"
                max="20000"
                step="1000"
                value={capitalRequired}
                onChange={(e) => setCapitalRequired(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$1,000</span>
                <span>$20,000</span>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isHumanitarian}
                  onChange={() => setIsHumanitarian(!isHumanitarian)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 mr-2"
                />
                <span className="text-sm text-gray-700">
                  Humanitarian Focus (addressing global challenges)
                </span>
              </label>
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors"
              >
                Save Business Model
              </button>
            </div>
          </div>
          
          {/* Right Column - Business Model Details */}
          <div className="lg:col-span-2">
            {currentBusinessType && (
              <>
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">{currentBusinessType.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{currentBusinessType.name}</h3>
                    <p className="text-gray-600">{currentBusinessType.description}</p>
                  </div>
                </div>
                
                {/* Business Details Tabs */}
                <div className="mb-6">
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                      <button
                        className={`py-2 px-4 border-b-2 font-medium text-sm ${
                          activeTab === 'overview'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('overview')}
                      >
                        Overview
                      </button>
                      <button
                        className={`py-2 px-4 border-b-2 font-medium text-sm ${
                          activeTab === 'buffett'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('buffett')}
                      >
                        Buffett Principles
                      </button>
                      <button
                        className={`py-2 px-4 border-b-2 font-medium text-sm ${
                          activeTab === 'ai'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('ai')}
                      >
                        AI Recommendations
                      </button>
                      <button
                        className={`py-2 px-4 border-b-2 font-medium text-sm ${
                          activeTab === 'milestones'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('milestones')}
                      >
                        Milestones
                      </button>
                    </nav>
                  </div>
                </div>
                
                {/* Tab Content */}
                <div className="tab-content">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Capital Required</p>
                          <p className="font-semibold">{currentBusinessType.capitalRange}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Time to Market</p>
                          <p className="font-semibold">{currentBusinessType.timeToMarket}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Scalability</p>
                          <p className="font-semibold">{currentBusinessType.scalability}</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-800 mb-2">Business Description</h4>
                        <p className="text-gray-700">
                          {currentBusinessType.description} This business model is designed to be started with minimal capital
                          (as low as ${capitalRequired.toLocaleString()}) and can be scaled over time using the principles of
                          value investing, long-term focus, and quality over quantity.
                        </p>
                      </div>
                      
                      {isHumanitarian && (
                        <div className="mb-6 bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2">Humanitarian Focus</h4>
                          <p className="text-green-700">
                            This business model is designed to address global challenges while remaining financially sustainable.
                            By focusing on both impact and profitability, you can create a venture that makes a difference
                            while generating returns.
                          </p>
                        </div>
                      )}
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-800 mb-2">Key Success Factors</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-indigo-500 mr-2">•</span>
                            <span>Focus on solving a specific problem for a well-defined target market</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-indigo-500 mr-2">•</span>
                            <span>Maintain low overhead costs during the early stages</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-indigo-500 mr-2">•</span>
                            <span>Prioritize customer retention and recurring revenue</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-indigo-500 mr-2">•</span>
                            <span>Leverage automation and digital tools to scale efficiently</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-indigo-500 mr-2">•</span>
                            <span>Build systems that can operate without constant founder involvement</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Buffett Principles Tab */}
                  {activeTab === 'buffett' && (
                    <div>
                      {Object.entries(buffettPrinciples).map(([key, principle]) => (
                        <div key={key} className="mb-6 p-4 border border-gray-200 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2">{principle.title}</h4>
                          <p className="text-gray-600 mb-3">{principle.description}</p>
                          <div className="bg-indigo-50 p-3 rounded-lg">
                            <p className="text-indigo-800 font-medium">Application to {currentBusinessType.name}:</p>
                            <p className="text-indigo-700">{principle.application[businessType]}</p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">Warren Buffett's Wisdom</h4>
                        <p className="text-yellow-700 italic">
                          "It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price."
                        </p>
                        <p className="text-yellow-700 mt-2">
                          This principle applies to entrepreneurship as well - it's better to build a wonderful business
                          in a good market than an average business in a hot market.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* AI Recommendations Tab */}
                  {activeTab === 'ai' && (
                    <div>
                      <p className="text-gray-600 mb-4">
                        Our AI has analyzed successful {currentBusinessType.name} businesses and generated
                        the following recommendations based on the four key characteristics of successful digital businesses.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center mb-2">
                            <span className="text-blue-500 text-xl mr-2">📊</span>
                            <h4 className="font-semibold text-gray-800">Datafication</h4>
                          </div>
                          <p className="text-gray-700">{recommendations.datafication}</p>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center mb-2">
                            <span className="text-purple-500 text-xl mr-2">🧠</span>
                            <h4 className="font-semibold text-gray-800">Algorithm</h4>
                          </div>
                          <p className="text-gray-700">{recommendations.algorithm}</p>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center mb-2">
                            <span className="text-green-500 text-xl mr-2">⚙️</span>
                            <h4 className="font-semibold text-gray-800">Automation</h4>
                          </div>
                          <p className="text-gray-700">{recommendations.automation}</p>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center mb-2">
                            <span className="text-red-500 text-xl mr-2">💡</span>
                            <h4 className="font-semibold text-gray-800">Innovation</h4>
                          </div>
                          <p className="text-gray-700">{recommendations.innovation}</p>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-indigo-800 mb-2">AI-Driven Insight</h4>
                        <p className="text-indigo-700">
                          For a {currentBusinessType.name} business with ${capitalRequired.toLocaleString()} starting capital,
                          focus on {stage === 'ideation' ? 'validating your concept with minimal investment' : 
                                   stage === 'validation' ? 'gathering customer feedback and refining your offering' :
                                   stage === 'development' ? 'building scalable systems and processes' :
                                   stage === 'launch' ? 'efficient customer acquisition channels' :
                                   'optimizing operations and exploring expansion opportunities'}.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Milestones Tab */}
                  {activeTab === 'milestones' && (
                    <div>
                      <p className="text-gray-600 mb-4">
                        Based on your selected business type ({currentBusinessType.name}) and stage ({stage}),
                        here are the key milestones to focus on:
                      </p>
                      
                      <div className="space-y-4 mb-6">
                        {milestones.map((milestone, index) => (
                          <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 bg-indigo-100 text-indigo-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mt-1">
                              {index + 1}
                            </div>
                            <div className="ml-4">
                              <h4 className="font-semibold text-gray-800">{milestone.title}</h4>
                              <p className="text-gray-600">{milestone.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">Next Steps</h4>
                        <p className="text-gray-700">
                          Focus on completing these milestones for the {stage} stage before moving to the
                          {stage === 'ideation' ? ' validation' : 
                           stage === 'validation' ? ' development' :
                           stage === 'development' ? ' launch' :
                           stage === 'launch' ? ' growth' :
                           ' scaling'} stage.
                          Track your progress and adjust your strategy based on what you learn along the way.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessModelGenerator;
