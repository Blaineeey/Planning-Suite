'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const router = useRouter();
  const [apiStatus, setApiStatus] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);

  const testAPI = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      const data = await response.json();
      setApiStatus(data);
    } catch (error) {
      setApiStatus({ error: error.message });
    }
  };

  const testDatabase = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stats/overview');
      const data = await response.json();
      setDbStatus(data);
    } catch (error) {
      setDbStatus({ error: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">System Test Page</h1>
          
          <div className="space-y-6">
            {/* API Test */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
              <button
                onClick={testAPI}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
              >
                Test API Health
              </button>
              {apiStatus && (
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(apiStatus, null, 2)}
                </pre>
              )}
            </div>

            {/* Database Test */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Database Test</h2>
              <button
                onClick={testDatabase}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4"
              >
                Test Database Stats
              </button>
              {dbStatus && (
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(dbStatus, null, 2)}
                </pre>
              )}
            </div>

            {/* Navigation Links */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Link
                  href="/login"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center"
                >
                  Login Page
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-center"
                >
                  Register Page
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-center"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/crm"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                >
                  CRM
                </Link>
                <Link
                  href="/dashboard/projects"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center"
                >
                  Projects
                </Link>
                <Link
                  href="/dashboard/guests"
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-center"
                >
                  Guests
                </Link>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">Demo Credentials</h2>
              <div className="space-y-2 text-blue-700">
                <p><strong>Email:</strong> demo@example.com</p>
                <p><strong>Password:</strong> demo123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
