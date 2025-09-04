'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    checkAPI();
  }, []);

  const checkAPI = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      if (response.ok) {
        const data = await response.json();
        setApiStatus('connected');
        setApiData(data);
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      setApiStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">RB</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Ruban Bleu Planning Suite</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">API Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                apiStatus === 'connected' ? 'bg-green-100 text-green-800' : 
                apiStatus === 'error' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {apiStatus === 'connected' ? '✓ Connected' : 
                 apiStatus === 'error' ? '✗ Disconnected' : 
                 '⟳ Checking...'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your All-in-One Wedding Planning Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Manage clients, projects, vendors, and create beautiful wedding websites
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </button>
            <button 
              onClick={checkAPI}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Test API Connection
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'CRM & Sales',
              description: 'Manage leads, proposals, contracts, and invoices',
              icon: '📊',
              status: 'Ready'
            },
            {
              title: 'Project Management',
              description: 'Tasks, timelines, budgets, and vendor coordination',
              icon: '📅',
              status: 'Ready'
            },
            {
              title: 'Wedding Websites',
              description: 'Beautiful custom websites with RSVP management',
              icon: '💒',
              status: 'Ready'
            },
            {
              title: 'Guest Management',
              description: 'Guest lists, RSVPs, seating charts, and meal preferences',
              icon: '👥',
              status: 'Coming Soon'
            },
            {
              title: 'Vendor Directory',
              description: 'Searchable database of trusted vendors',
              icon: '🏪',
              status: 'Coming Soon'
            },
            {
              title: 'Digital Shop',
              description: 'Sell templates, checklists, and digital products',
              icon: '🛍️',
              status: 'Coming Soon'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{feature.icon}</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  feature.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {feature.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API Test Section */}
      {apiData && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">API Response:</h3>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
              {JSON.stringify(apiData, null, 2)}
            </pre>
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
            { name: 'Projects', href: '/projects', icon: '📁' },
            { name: 'Clients', href: '/clients', icon: '👤' },
            { name: 'Calendar', href: '/calendar', icon: '📅' },
            { name: 'Invoices', href: '/invoices', icon: '💰' },
            { name: 'Vendors', href: '/vendors', icon: '🏢' },
            { name: 'Settings', href: '/settings', icon: '⚙️' },
            { name: 'Help', href: '/help', icon: '❓' }
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="flex items-center space-x-3 p-4 bg-white rounded-lg border hover:border-blue-500 hover:shadow-sm transition"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="font-medium text-gray-900">{link.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 Ruban Bleu Planning Suite. All rights reserved.</p>
            <p className="mt-2 text-sm">
              API: http://localhost:3001 | Web: http://localhost:3000
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
