import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AuctionPage from './pages/AuctionPage';
import BusinessSolutionsPage from './pages/BusinessSolutionsPage';
import FinancePage from './pages/FinancePage';
import ConstructionServicesPage from './pages/ConstructionServicesPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertyListingPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/auctions" element={<AuctionPage />} />
          <Route path="/business-solutions" element={<BusinessSolutionsPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/construction-services" element={<ConstructionServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
