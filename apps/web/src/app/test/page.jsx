'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAPI();
  }, []);

  const checkAPI = async () => {
    try {
      // Test basic API connection
      const response = await fetch('http://localhost:3001/health');
      if (response.ok) {
        const data = await response.json();
        setApiStatus('connected');
        setApiData(data);
      } else {
        setApiStatus('error');
        setError('API returned error status');
      }
    } catch (error) {
      console.error('API connection error:', error);
      setApiStatus('error');
      setError(error.message);
    }
  };

  const testLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'demo@example.com',
          password: 'demo123'
        })
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      alert('Login response: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Status</h2>
          <div className="flex items-center space-x-2 mb-4">
            <span className="font-medium">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              apiStatus === 'connected' ? 'bg-green-100 text-green-800' : 
              apiStatus === 'error' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {apiStatus === 'connected' ? '✓ Connected' : 
               apiStatus === 'error' ? '✗ Error' : 
               '⟳ Checking...'}
            </span>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-red-600 text-sm">Error: {error}</p>
            </div>
          )}
          
          <div className="space-x-4">
            <button 
              onClick={checkAPI}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Check API Health
            </button>
            
            <button 
              onClick={testLogin}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test Login
            </button>
          </div>
        </div>

        {apiData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">API Response</h2>
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(apiData, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Test Credentials</h2>
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm"><strong>Email:</strong> demo@example.com</p>
            <p className="text-sm"><strong>Password:</strong> demo123</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="space-y-2">
            <a href="/login" className="block text-blue-600 hover:underline">→ Go to Login Page</a>
            <a href="/register" className="block text-blue-600 hover:underline">→ Go to Register Page</a>
            <a href="/dashboard" className="block text-blue-600 hover:underline">→ Go to Dashboard (requires login)</a>
            <a href="http://localhost:3001" target="_blank" className="block text-blue-600 hover:underline">→ View API Docs</a>
            <a href="http://localhost:3001/health" target="_blank" className="block text-blue-600 hover:underline">→ Check API Health</a>
          </div>
        </div>
      </div>
    </div>
  );
}
