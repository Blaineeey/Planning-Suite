'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Eye,
  Shield,
  Award,
  Calendar,
  MessageSquare
} from 'lucide-react';

export default function VendorsPage() {
  const [activeView, setActiveView] = useState('directory');
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddVendor, setShowAddVendor] = useState(false);

  useEffect(() => {
    fetchVendorsData();
  }, [selectedCategory, priceRange]);

  const fetchVendorsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      // Build query params
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (priceRange !== 'all') params.append('priceRange', priceRange);
      
      // Fetch vendors
      const vendorsResponse = await fetch(`http://localhost:3001/api/vendors?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (vendorsResponse.ok) {
        const vendorsData = await vendorsResponse.json();
        setVendors(vendorsData.data || []);
      }
      
      // Fetch categories
      const categoriesResponse = await fetch('http://localhost:3001/api/vendor-categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = async (vendorData) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/vendors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vendorData)
      });
      
      if (response.ok) {
        fetchVendorsData();
        setShowAddVendor(false);
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i < fullStars ? 'text-yellow-400 fill-current' : 'text-gray-300'}
        />
      );
    }
    
    return <div className="flex items-center">{stars}</div>;
  };

  const tabs = [
    { id: 'directory', name: 'Vendor Directory' },
    { id: 'my-vendors', name: 'My Vendors' },
    { id: 'requests', name: 'Vendor Requests' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
              <p className="text-gray-600 mt-1">Find and manage wedding vendors</p>
            </div>
            <button
              onClick={() => setShowAddVendor(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
            >
              <Plus size={20} className="mr-2" />
              Add Vendor
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeView === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Prices</option>
              <option value="$">$ - Budget</option>
              <option value="$$">$$ - Moderate</option>
              <option value="$$$">$$$ - Premium</option>
              <option value="$$$$">$$$$ - Luxury</option>
            </select>
          </div>
        </div>

        {/* Vendor Directory */}
        {activeView === 'directory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {/* Vendor Image */}
                <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-lg relative">
                  {vendor.featured && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded">
                      Featured
                    </span>
                  )}
                  {vendor.verified && (
                    <div className="absolute top-2 left-2 p-2 bg-white rounded-full">
                      <Shield className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                </div>
                
                {/* Vendor Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">{vendor.category}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    {renderRating(vendor.rating)}
                    <span className="text-sm text-gray-500">
                      {vendor.reviewCount || 0} reviews
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {vendor.description || 'No description available'}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {vendor.priceRange && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign size={14} className="mr-2" />
                        {vendor.priceRange}
                      </div>
                    )}
                    {vendor.serviceArea && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={14} className="mr-2" />
                        {Array.isArray(vendor.serviceArea) ? vendor.serviceArea.join(', ') : vendor.serviceArea}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                      View Details
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Vendors */}
        {activeView === 'my-vendors' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">
                No vendors added to your projects yet. Browse the directory to find vendors.
              </p>
            </div>
          </div>
        )}

        {/* Vendor Requests */}
        {activeView === 'requests' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">
                No pending vendor requests. Start by contacting vendors from the directory.
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredVendors.length === 0 && activeView === 'directory' && (
          <div className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No vendors found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
