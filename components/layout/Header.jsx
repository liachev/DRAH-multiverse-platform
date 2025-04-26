import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Multiverse Platform
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition-colors">
              Properties
            </Link>
            <Link to="/auctions" className="text-gray-700 hover:text-blue-600 transition-colors">
              Auctions
            </Link>
            <Link to="/business-solutions" className="text-gray-700 hover:text-blue-600 transition-colors">
              Business Solutions
            </Link>
            <Link to="/finance" className="text-gray-700 hover:text-blue-600 transition-colors">
              DRAH Finance
            </Link>
            <Link to="/construction-services" className="text-gray-700 hover:text-blue-600 transition-colors">
              Construction
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>
          
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
