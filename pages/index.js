import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-100 font-sans">
      <Head>
        <title>Multiverse Platform for Real Estate Solutions</title>
        <meta name="description" content="A platform combining metaverse and real-world functionalities with a focus on real estate and business solutions" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
      </Head>

      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">Multiverse Platform</div>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link></li>
              <li><Link href="/properties" className="text-gray-600 hover:text-blue-600">Properties</Link></li>
              <li><Link href="/auctions" className="text-gray-600 hover:text-blue-600">Auctions</Link></li>
              <li><Link href="/business-solutions" className="text-gray-600 hover:text-blue-600">Business Solutions</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-12 bg-blue-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Multiverse Platform for Real Estate Solutions</h1>
            <p className="text-xl mb-8">Bridging the gap between virtual and physical real estate markets</p>
            <div className="flex justify-center space-x-4">
              <Link href="/properties" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Browse Properties
              </Link>
              <Link href="/contact" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Real Estate Marketplace</h3>
                <p className="text-gray-600 mb-4">Discover properties in both physical and virtual worlds with our comprehensive marketplace.</p>
                <Link href="/properties" className="text-blue-600 hover:text-blue-800">Learn More →</Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Property Auctions</h3>
                <p className="text-gray-600 mb-4">Participate in transparent and competitive auctions for exclusive real estate opportunities.</p>
                <Link href="/auctions" className="text-blue-600 hover:text-blue-800">Learn More →</Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Business Solutions</h3>
                <p className="text-gray-600 mb-4">Comprehensive tools for real estate professionals, investors, and businesses.</p>
                <Link href="/business-solutions" className="text-blue-600 hover:text-blue-800">Learn More →</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">Multiverse Platform</h3>
              <p className="text-gray-400">Bridging the gap between virtual and physical real estate markets</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/properties" className="text-gray-400 hover:text-white">Properties</Link></li>
                <li><Link href="/auctions" className="text-gray-400 hover:text-white">Auctions</Link></li>
                <li><Link href="/business-solutions" className="text-gray-400 hover:text-white">Business Solutions</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Multiverse Platform for Real Estate Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
