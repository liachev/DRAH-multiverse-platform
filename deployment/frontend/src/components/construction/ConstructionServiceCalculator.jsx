import React, { useState } from 'react';

/**
 * ConstructionServiceCalculator component
 * Calculates construction costs with AEC DRAH 10% savings
 */
const ConstructionServiceCalculator = () => {
  const [squareFootage, setSquareFootage] = useState(1800);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [stories, setStories] = useState(1);
  const [packageType, setPackageType] = useState('standard');
  const [features, setFeatures] = useState({
    garage: true,
    porch: false,
    energyEfficient: true,
    hurricaneResistant: true,
    smartHome: false
  });
  
  // Price per square foot based on package type
  const pricePerSqFt = {
    standard: 175,
    premium: 225,
    custom: 275
  };
  
  // Calculate base price
  const calculateBasePrice = () => {
    return squareFootage * pricePerSqFt[packageType];
  };
  
  // Calculate additional costs for features
  const calculateFeatureCosts = () => {
    let additionalCost = 0;
    
    if (features.garage) additionalCost += 25000;
    if (features.porch) additionalCost += 15000;
    if (features.smartHome) additionalCost += 10000;
    
    // Bedrooms and bathrooms beyond base (3 bed, 2 bath)
    if (bedrooms > 3) additionalCost += (bedrooms - 3) * 10000;
    if (bathrooms > 2) additionalCost += (bathrooms - 2) * 15000;
    
    // Additional story
    if (stories > 1) additionalCost += squareFootage * 50;
    
    return additionalCost;
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    return calculateBasePrice() + calculateFeatureCosts();
  };
  
  // Calculate market price (without DRAH savings)
  const calculateMarketPrice = () => {
    return calculateTotalPrice() / 0.9; // 10% higher than DRAH price
  };
  
  // Calculate savings
  const calculateSavings = () => {
    return calculateMarketPrice() - calculateTotalPrice();
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // This would be implemented in step 005 when we create the backend functions
    console.log('Submitting construction service request');
  };
  
  // Handle feature toggle
  const handleFeatureToggle = (feature) => {
    setFeatures({
      ...features,
      [feature]: !features[feature]
    });
  };
  
  return (
    <div className="construction-calculator bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">AEC DRAH Construction Services</h2>
      <p className="text-gray-600 mb-6">
        Design and build your dream home with AEC DRAH construction services. Save up to 10% compared to market prices.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calculator Inputs */}
        <div>
          <form onSubmit={handleSubmit}>
            {/* Package Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div 
                  className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    packageType === 'standard' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                  onClick={() => setPackageType('standard')}
                >
                  <div className="font-semibold mb-1">Standard</div>
                  <div className="text-sm text-gray-500">${pricePerSqFt.standard}/sqft</div>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    packageType === 'premium' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                  onClick={() => setPackageType('premium')}
                >
                  <div className="font-semibold mb-1">Premium</div>
                  <div className="text-sm text-gray-500">${pricePerSqFt.premium}/sqft</div>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    packageType === 'custom' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                  onClick={() => setPackageType('custom')}
                >
                  <div className="font-semibold mb-1">Custom</div>
                  <div className="text-sm text-gray-500">${pricePerSqFt.custom}/sqft</div>
                </div>
              </div>
            </div>
            
            {/* Square Footage */}
            <div className="mb-4">
              <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700 mb-1">
                Square Footage: {squareFootage} sqft
              </label>
              <input
                type="range"
                id="squareFootage"
                min="1000"
                max="5000"
                step="100"
                value={squareFootage}
                onChange={(e) => setSquareFootage(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1,000 sqft</span>
                <span>5,000 sqft</span>
              </div>
            </div>
            
            {/* Bedrooms and Bathrooms */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <select
                  id="bedrooms"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="5">5 Bedrooms</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <select
                  id="bathrooms"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1 Bathroom</option>
                  <option value="1.5">1.5 Bathrooms</option>
                  <option value="2">2 Bathrooms</option>
                  <option value="2.5">2.5 Bathrooms</option>
                  <option value="3">3 Bathrooms</option>
                  <option value="3.5">3.5 Bathrooms</option>
                </select>
              </div>
            </div>
            
            {/* Stories */}
            <div className="mb-4">
              <label htmlFor="stories" className="block text-sm font-medium text-gray-700 mb-1">
                Stories
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className={`flex-1 py-2 border rounded-md ${
                    stories === 1 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300 text-gray-700'
                  }`}
                  onClick={() => setStories(1)}
                >
                  Single Story
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 border rounded-md ${
                    stories === 2 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300 text-gray-700'
                  }`}
                  onClick={() => setStories(2)}
                >
                  Two Story
                </button>
              </div>
            </div>
            
            {/* Features */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={features.garage}
                    onChange={() => handleFeatureToggle('garage')}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                  />
                  <span>Garage (+$25,000)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={features.porch}
                    onChange={() => handleFeatureToggle('porch')}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                  />
                  <span>Front Porch (+$15,000)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={features.energyEfficient}
                    onChange={() => handleFeatureToggle('energyEfficient')}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                  />
                  <span>Energy Efficient (Included)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={features.hurricaneResistant}
                    onChange={() => handleFeatureToggle('hurricaneResistant')}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                  />
                  <span>Hurricane Resistant (Included)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={features.smartHome}
                    onChange={() => handleFeatureToggle('smartHome')}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                  />
                  <span>Smart Home Features (+$10,000)</span>
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors"
            >
              Request Construction Quote
            </button>
          </form>
        </div>
        
        {/* Calculator Results */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Construction Estimate</h3>
          
          <div className="mb-6">
            <p className="text-sm text-gray-500">Total Construction Cost</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(calculateTotalPrice())}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Market Price: <span className="line-through">{formatCurrency(calculateMarketPrice())}</span>
            </p>
            <p className="text-sm text-green-600 font-medium">
              You Save: {formatCurrency(calculateSavings())} (10%)
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Construction:</span>
              <span className="font-medium">{formatCurrency(calculateBasePrice())}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Additional Features:</span>
              <span className="font-medium">{formatCurrency(calculateFeatureCosts())}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Price per Square Foot:</span>
              <span className="font-medium">${pricePerSqFt[packageType]}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Total Square Footage:</span>
              <span className="font-medium">{squareFootage} sqft</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Bedrooms:</span>
              <span className="font-medium">{bedrooms}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Bathrooms:</span>
              <span className="font-medium">{bathrooms}</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">AEC DRAH Construction Benefits</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>10% savings compared to market prices</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Energy-efficient construction standard</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Hurricane-resistant construction standard</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Streamlined permitting process</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Integrated with DRAH Finance options</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-500 italic">
              * This is an estimate only. Final pricing may vary based on site conditions, material costs, and specific design requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructionServiceCalculator;
