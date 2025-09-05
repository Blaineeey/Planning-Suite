'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [apiData, setApiData] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    checkAPI();
    fetchStats();
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
      console.error('API connection error:', error);
      setApiStatus('error');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const testAPI = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`);
      const data = await response.json();
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      alert('Error: ' + error.message);
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
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
          <div className="flex justify-center space-x-4 mb-8">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={checkAPI}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Refresh API Status
            </button>
            <button 
              onClick={() => testAPI('/api/projects')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Test Projects API
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <h3 className="font-semibold text-blue-900 mb-2">Demo Credentials</h3>
            <p className="text-sm text-blue-800">Email: demo@example.com</p>
            <p className="text-sm text-blue-800">Password: demo123</p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      {stats && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Live Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.users || 0}</div>
              <div className="text-gray-600">Users</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{stats.projects || 0}</div>
              <div className="text-gray-600">Projects</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.leads || 0}</div>
              <div className="text-gray-600">Leads</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.tasks || 0}</div>
              <div className="text-gray-600">Tasks</div>
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'CRM & Sales',
              description: 'Manage leads, proposals, contracts, and invoices',
              icon: '📊',
              status: 'Ready',
              endpoint: '/api/leads'
            },
            {
              title: 'Project Management',
              description: 'Tasks, timelines, budgets, and vendor coordination',
              icon: '📅',
              status: 'Ready',
              endpoint: '/api/projects'
            },
            {
              title: 'Task Management',
              description: 'Create, assign, and track tasks',
              icon: '✅',
              status: 'Ready',
              endpoint: '/api/tasks'
            },
            {
              title: 'Guest Management',
              description: 'Guest lists, RSVPs, seating charts',
              icon: '👥',
              status: 'Coming Soon',
              endpoint: null
            },
            {
              title: 'Vendor Directory',
              description: 'Searchable database of vendors',
              icon: '🏪',
              status: 'Coming Soon',
              endpoint: null
            },
            {
              title: 'Invoices',
              description: 'Create and manage invoices',
              icon: '💰',
              status: 'Ready',
              endpoint: '/api/invoices'
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
              <p className="text-gray-600 mb-3">{feature.description}</p>
              {feature.endpoint && (
                <button
                  onClick={() => testAPI(feature.endpoint)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Test API →
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* API Response Display */}
      {apiData && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">API Health Response:</h3>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(apiData, null, 2)}
            </pre>
          </div>
        </section>
      )}

      {/* API Endpoints */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Available API Endpoints</h3>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
            <div className="space-y-2">
              <div className="text-green-600">GET /health</div>
              <div className="text-blue-600">POST /api/auth/register</div>
              <div className="text-blue-600">POST /api/auth/login</div>
              <div className="text-green-600">GET /api/auth/me</div>
              <div className="text-green-600">GET /api/stats</div>
            </div>
            <div className="space-y-2">
              <div className="text-green-600">GET /api/projects</div>
              <div className="text-blue-600">POST /api/projects</div>
              <div className="text-green-600">GET /api/leads</div>
              <div className="text-blue-600">POST /api/leads</div>
              <div className="text-green-600">GET /api/tasks</div>
              <div className="text-blue-600">POST /api/tasks</div>
            </div>
          </div>
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
            <p className="mt-2 text-xs text-gray-500">
              Database: In-Memory (No external database required)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
