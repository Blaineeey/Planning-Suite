'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Store, Search, Filter, Plus, Star, MapPin, DollarSign } from 'lucide-react';

export default function VendorsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Directory</h1>
            <p className="text-gray-500 mt-1">Find and manage wedding vendors</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700">
            <Plus size={18} className="inline mr-2" />
            Add Vendor
          </button>
        </div>

        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <Store size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Vendor Management</h2>
          <p className="text-gray-500">Browse and manage your preferred vendors, track bookings, and handle vendor communications.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
