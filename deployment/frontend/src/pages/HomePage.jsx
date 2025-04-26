import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Multiverse Platform Portal Exchange</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Bridging real-world and metaverse opportunities with innovative real estate and business solutions
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/properties" className="btn-primary text-center">
              Explore Properties
            </Link>
            <Link to="/business" className="btn-secondary text-center">
              Business Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition duration-300 card-hover">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Property Management</h3>
              <p className="text-gray-600 mb-4">
                Explore both real-world and metaverse properties with advanced search and DRAH eligibility identification.
              </p>
              <Link to="/properties" className="text-blue-600 hover:text-blue-800 font-medium">
                View Properties →
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition duration-300 card-hover">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Auction System</h3>
              <p className="text-gray-600 mb-4">
                Participate in our three-step CivicSource auction process: Select, Deposit, and Win properties.
              </p>
              <Link to="/auctions" className="text-blue-600 hover:text-blue-800 font-medium">
                View Auctions →
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition duration-300 card-hover">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">DRAH Finance</h3>
              <p className="text-gray-600 mb-4">
                Access specialized financing with no PMI, no down payment, and a minimum FICO score of 500.
              </p>
              <Link to="/finance" className="text-blue-600 hover:text-blue-800 font-medium">
                Learn More →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition duration-300 card-hover">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AEC Construction Services</h3>
              <p className="text-gray-600 mb-4">
                Build your dream home with our construction services offering 10% savings compared to market prices, energy-efficient and hurricane-resistant construction.
              </p>
              <Link to="/construction" className="text-blue-600 hover:text-blue-800 font-medium">
                Explore Services →
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition duration-300 card-hover">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Driven Business Modeling</h3>
              <p className="text-gray-600 mb-4">
                Develop your business with our AI-driven modeling tools based on Warren Buffett principles, supporting various business types and humanitarian ventures.
              </p>
              <Link to="/business" className="text-blue-600 hover:text-blue-800 font-medium">
                Start Modeling →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our platform today and discover the future of real estate and business solutions across both real-world and metaverse environments.
          </p>
          <Link to="/properties" className="bg-white text-blue-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition duration-300">
            Explore Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
