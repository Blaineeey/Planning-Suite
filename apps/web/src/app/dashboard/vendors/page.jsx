'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import VendorForm from '@/components/vendors/VendorForm';
import { api } from '@/lib/api';
import {
  Store,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Globe,
  MapPin,
  Star,
  DollarSign,
  Edit,
  Trash2,
  MoreVertical,
  AlertCircle,
  Tag
} from 'lucide-react';

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingVendor, setDeletingVendor] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const data = await api.vendors.list();
      setVendors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleCreateVendor = async (vendorData) => {
    try {
      const newVendor = await api.vendors.create(vendorData);
      if (newVendor) {
        setVendors([newVendor, ...vendors]);
        setShowVendorForm(false);
      }
    } catch (error) {
      console.error('Failed to create vendor:', error);
      alert('Failed to create vendor. Please try again.');
    }
  };

  const handleUpdateVendor = async (vendorData) => {
    try {
      const updatedVendor = await api.vendors.update(editingVendor.id, vendorData);
      if (updatedVendor) {
        setVendors(vendors.map(vendor => 
          vendor.id === editingVendor.id ? updatedVendor : vendor
        ));
        setEditingVendor(null);
        setShowVendorForm(false);
      }
    } catch (error) {
      console.error('Failed to update vendor:', error);
      alert('Failed to update vendor. Please try again.');
    }
  };

  const handleDeleteVendor = async () => {
    if (!deletingVendor) return;
    
    try {
      await api.vendors.delete(deletingVendor.id);
      setVendors(vendors.filter(vendor => vendor.id !== deletingVendor.id));
      setShowDeleteConfirm(false);
      setDeletingVendor(null);
    } catch (error) {
      console.error('Failed to delete vendor:', error);
      alert('Failed to delete vendor. Please try again.');
    }
  };

  const handleEditClick = (vendor) => {
    setEditingVendor(vendor);
    setShowVendorForm(true);
  };

  const handleDeleteClick = (vendor) => {
    setDeletingVendor(vendor);
    setShowDeleteConfirm(true);
  };

  const getPriceSymbol = (range) => {
    switch (range) {
      case 'BUDGET': return '$';
      case 'MODERATE': return '$$';
      case 'PREMIUM': return '$$$';
      case 'LUXURY': return '$$$$';
      default: return '$$';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      VENUE: MapPin,
      PHOTOGRAPHER: Globe,
      CATERING: Store,
      FLORIST: Store,
      DJ: Store,
      PLANNER: Store
    };
    return icons[category] || Store;
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || vendor.category === filterCategory;
    const matchesPrice = filterPrice === 'all' || vendor.priceRange === filterPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = [...new Set(vendors.map(v => v.category))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Directory</h1>
            <p className="text-gray-500 mt-1">Manage your preferred vendors and suppliers</p>
          </div>
          <button
            onClick={() => {
              setEditingVendor(null);
              setShowVendorForm(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
          >
            <Plus size={18} className="inline mr-2" />
            Add Vendor
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
              </div>
              <Store size={24} className="text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Preferred</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vendors.filter(v => v.preferredVendor).length}
                </p>
              </div>
              <Star size={24} className="text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <Tag size={24} className="text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Commission</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vendors.length > 0 
                    ? (vendors.reduce((sum, v) => sum + (v.commission || 0), 0) / vendors.length).toFixed(1)
                    : 0}%
                </p>
              </div>
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vendors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat?.charAt(0) + cat?.slice(1).toLowerCase().replace('_', ' ')}
                </option>
              ))}
            </select>
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              <option value="all">All Prices</option>
              <option value="BUDGET">Budget ($)</option>
              <option value="MODERATE">Moderate ($$)</option>
              <option value="PREMIUM">Premium ($$$)</option>
              <option value="LUXURY">Luxury ($$$$)</option>
            </select>
          </div>
        </div>

        {/* Vendors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading vendors...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <Store size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No vendors found</p>
            <button
              onClick={() => {
                setEditingVendor(null);
                setShowVendorForm(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus size={16} className="mr-2" />
              Add your first vendor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => {
              const Icon = getCategoryIcon(vendor.category);
              return (
                <div key={vendor.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  {/* Vendor Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Icon size={24} className="text-white" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                          <p className="text-sm text-gray-500">
                            {vendor.category?.charAt(0) + vendor.category?.slice(1).toLowerCase().replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="relative group">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical size={18} className="text-gray-400" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <button
                            onClick={() => handleEditClick(vendor)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <Edit size={16} className="mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(vendor)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm">
                      {vendor.contactName && (
                        <p className="text-gray-600">Contact: {vendor.contactName}</p>
                      )}
                      {vendor.email && (
                        <div className="flex items-center text-gray-600">
                          <Mail size={14} className="mr-2" />
                          {vendor.email}
                        </div>
                      )}
                      {vendor.phone && (
                        <div className="flex items-center text-gray-600">
                          <Phone size={14} className="mr-2" />
                          {vendor.phone}
                        </div>
                      )}
                      {vendor.website && (
                        <div className="flex items-center text-gray-600">
                          <Globe size={14} className="mr-2" />
                          <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                            Website
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {getPriceSymbol(vendor.priceRange)}
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < vendor.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      {vendor.preferredVendor && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Preferred
                        </span>
                      )}
                    </div>

                    {vendor.commission && (
                      <p className="text-xs text-gray-500 mt-2">
                        Commission: {vendor.commission}%
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Vendor Form Modal */}
      <VendorForm
        isOpen={showVendorForm}
        onClose={() => {
          setShowVendorForm(false);
          setEditingVendor(null);
        }}
        onSubmit={editingVendor ? handleUpdateVendor : handleCreateVendor}
        vendor={editingVendor}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Vendor
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {deletingVendor?.name}? 
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleDeleteVendor}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingVendor(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
