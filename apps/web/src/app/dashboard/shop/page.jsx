'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { ShoppingBag, Plus, Package, Download, DollarSign, TrendingUp } from 'lucide-react';

export default function ShopPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Digital Shop</h1>
            <p className="text-gray-500 mt-1">Sell wedding templates and digital products</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700">
            <Plus size={18} className="inline mr-2" />
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">$12,450</p>
              </div>
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <Package size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
              <Download size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Digital Products Shop</h2>
          <p className="text-gray-500">Sell wedding planning templates, contracts, checklists, and other digital products to grow your revenue.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
