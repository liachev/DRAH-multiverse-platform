import React, { useState } from 'react';

/**
 * FinanceCalculator component
 * Calculates mortgage payments for DRAH Finance options
 */
const FinanceCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(200000);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(4.5);
  const [ficoScore, setFicoScore] = useState(650);
  const [loanType, setLoanType] = useState('standard_mortgage');
  
  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const principal = parseFloat(loanAmount);
    const calculatedInterest = parseFloat(interestRate) / 100 / 12;
    const calculatedPayments = parseFloat(loanTerm) * 12;
    
    // Monthly payment formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);
    
    return isFinite(monthly) ? monthly.toFixed(2) : '0.00';
  };
  
  // Check DRAH eligibility
  const isDRAHEligible = ficoScore >= 500;
  
  // Calculate total payment over loan term
  const calculateTotalPayment = () => {
    const monthly = parseFloat(calculateMonthlyPayment());
    const term = parseFloat(loanTerm) * 12;
    return (monthly * term).toFixed(2);
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
    console.log('Submitting finance application');
  };
  
  return (
    <div className="finance-calculator bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">DRAH Finance Calculator</h2>
      <p className="text-gray-600 mb-6">
        Calculate your monthly payments with DRAH Finance - No PMI, No Down Payment required with minimum FICO score of 500.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calculator Inputs */}
        <div>
          <form>
            {/* Loan Amount */}
            <div className="mb-4">
              <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Amount: {formatCurrency(loanAmount)}
              </label>
              <input
                type="range"
                id="loanAmount"
                min="50000"
                max="1000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$50,000</span>
                <span>$1,000,000</span>
              </div>
            </div>
            
            {/* Loan Term */}
            <div className="mb-4">
              <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Term: {loanTerm} years
              </label>
              <select
                id="loanTerm"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="30">30 Years</option>
              </select>
            </div>
            
            {/* Interest Rate */}
            <div className="mb-4">
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate: {interestRate}%
              </label>
              <input
                type="range"
                id="interestRate"
                min="2.5"
                max="8.0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2.5%</span>
                <span>8.0%</span>
              </div>
            </div>
            
            {/* FICO Score */}
            <div className="mb-4">
              <label htmlFor="ficoScore" className="block text-sm font-medium text-gray-700 mb-1">
                FICO Score: {ficoScore}
              </label>
              <input
                type="range"
                id="ficoScore"
                min="300"
                max="850"
                step="10"
                value={ficoScore}
                onChange={(e) => setFicoScore(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>300</span>
                <span>850</span>
              </div>
              <div className={`mt-2 text-sm ${isDRAHEligible ? 'text-green-600' : 'text-red-600'}`}>
                {isDRAHEligible 
                  ? '✓ Eligible for DRAH Finance' 
                  : '✗ DRAH Finance requires minimum FICO score of 500'}
              </div>
            </div>
            
            {/* Loan Type */}
            <div className="mb-4">
              <label htmlFor="loanType" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Type
              </label>
              <select
                id="loanType"
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="standard_mortgage">Standard Mortgage</option>
                <option value="construction_to_permanent">Construction-to-Permanent</option>
                <option value="rehabilitation">Rehabilitation Loan</option>
              </select>
            </div>
            
            {/* Apply Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!isDRAHEligible}
              className={`w-full py-3 font-bold rounded-md ${
                isDRAHEligible 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Apply for DRAH Finance
            </button>
          </form>
        </div>
        
        {/* Calculator Results */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h3>
          
          <div className="mb-6">
            <p className="text-sm text-gray-500">Estimated Monthly Payment</p>
            <p className="text-3xl font-bold text-blue-600">
              ${parseFloat(calculateMonthlyPayment()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Loan Amount:</span>
              <span className="font-medium">{formatCurrency(loanAmount)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Loan Term:</span>
              <span className="font-medium">{loanTerm} years</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Interest Rate:</span>
              <span className="font-medium">{interestRate}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Total Loan Cost:</span>
              <span className="font-medium">
                ${parseFloat(calculateTotalPayment()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Down Payment:</span>
              <span className="font-medium text-green-600">$0 (No down payment required)</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">PMI:</span>
              <span className="font-medium text-green-600">$0 (No PMI required)</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">DRAH Finance Benefits</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Minimum FICO score of 500</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>No Private Mortgage Insurance (PMI)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>No down payment required</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Flexible loan terms (15, 20, or 30 years)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Construction-to-permanent loan options</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceCalculator;
