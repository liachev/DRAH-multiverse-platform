import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">
              Multiverse Platform
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/properties" className="hover:text-blue-300 transition duration-300">
              Properties
            </Link>
            <Link to="/auctions" className="hover:text-blue-300 transition duration-300">
              Auctions
            </Link>
            <Link to="/finance" className="hover:text-blue-300 transition duration-300">
              DRAH Finance
            </Link>
            <Link to="/construction" className="hover:text-blue-300 transition duration-300">
              Construction
            </Link>
            <Link to="/business" className="hover:text-blue-300 transition duration-300">
              Business Models
            </Link>
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-3">
            <Link 
              to="/properties" 
              className="block hover:text-blue-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Properties
            </Link>
            <Link 
              to="/auctions" 
              className="block hover:text-blue-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Auctions
            </Link>
            <Link 
              to="/finance" 
              className="block hover:text-blue-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              DRAH Finance
            </Link>
            <Link 
              to="/construction" 
              className="block hover:text-blue-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Construction
            </Link>
            <Link 
              to="/business" 
              className="block hover:text-blue-300 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Business Models
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
