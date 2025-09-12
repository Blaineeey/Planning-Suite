'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { 
  DollarSign, 
  CreditCard, 
  Clock, 
  XCircle,
  FileText,
  AlertCircle,
  Settings
} from 'lucide-react';

export default function PaymentsPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    thisMonth: 0
  });

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const fetchInvoiceData = async () => {
    setLoading(true);
    try {
      const invoicesData = await api.crm.invoices.list();
      const invoicesArray = Array.isArray(invoicesData) ? invoicesData : [];
      setInvoices(invoicesArray);
      calculateStats(invoicesArray);
    } catch (error) {
      console.error('Failed to fetch invoice data:', error);
      setInvoices([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (invoicesList) => {
    // Ensure we have an array
    const invoices = Array.isArray(invoicesList) ? invoicesList : [];
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const stats = {
      totalRevenue: invoices
        .filter(i => i.status === 'PAID')
        .reduce((sum, i) => sum + (i.total || 0), 0),
      pendingAmount: invoices
        .filter(i => i.status === 'SENT' || i.status === 'PENDING_PAYMENT')
        .reduce((sum, i) => sum + (i.total || 0), 0),
      overdueAmount: invoices
        .filter(i => {
          if (i.status === 'PAID') return false;
          if (!i.dueDate) return false;
          return new Date(i.dueDate) < now;
        })
        .reduce((sum, i) => sum + (i.total || 0), 0),
      thisMonth: 0 // Would need payment data to calculate
    };
    
    setStats(stats);
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-700',
      SENT: 'bg-blue-100 text-blue-700',
      PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
      PAID: 'bg-green-100 text-green-700',
      OVERDUE: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments & Invoicing</h1>
            <p className="text-gray-500 mt-1">Manage invoices and track payments</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/crm')}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
          >
            Create Invoice
          </button>
        </div>

        {/* Payment Processing Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-400 mt-0.5 mr-3" size={20} />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Payment Processing Setup Required</h3>
              <p className="mt-1 text-sm text-blue-700">
                To enable payment processing, you need to:
              </p>
              <ol className="mt-2 text-sm text-blue-700 list-decimal list-inside space-y-1">
                <li>Install Stripe dependencies: <code className="bg-blue-100 px-1 rounded">npm install @stripe/stripe-js @stripe/react-stripe-js</code></li>
                <li>Add your Stripe API keys to the environment variables</li>
                <li>Configure your Stripe webhook endpoint</li>
              </ol>
              <p className="mt-2 text-sm text-blue-600">
                For now, you can create and manage invoices. Payment processing will be available once Stripe is configured.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">From paid invoices</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.pendingAmount.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Awaiting payment</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.overdueAmount.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle size={20} className="text-red-600" />
              </div>
            </div>
            <p className="text-xs text-red-600 mt-2">Requires attention</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.length}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">All time</p>
          </div>
        </div>

        {/* Invoice List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No invoices found</p>
                <button
                  onClick={() => router.push('/dashboard/crm')}
                  className="mt-4 text-purple-600 hover:text-purple-700"
                >
                  Create your first invoice
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <h3 className="font-medium text-gray-900">
                            Invoice #{invoice.number}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                          <span>{invoice.clientName || 'No client'}</span>
                          <span>Due: {invoice.dueDate || 'Not set'}</span>
                          <span className="font-medium text-gray-900">
                            ${(invoice.total || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {invoice.status === 'PAID' ? (
                          <span className="text-sm text-green-600 flex items-center">
                            <CreditCard size={16} className="mr-1" />
                            Paid
                          </span>
                        ) : (
                          <div className="text-sm text-gray-500 flex items-center">
                            <Settings size={16} className="mr-1" />
                            Payment setup required
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Invoice Management Features Available
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Invoices</p>
                <p className="text-sm text-gray-500">Generate professional invoices for your clients</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Track Status</p>
                <p className="text-sm text-gray-500">Monitor invoice status and payment history</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Financial Overview</p>
                <p className="text-sm text-gray-500">View revenue statistics and pending amounts</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-600 text-xs">⏸</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Online Payments (Coming Soon)</p>
                <p className="text-sm text-gray-500">Accept credit card payments via Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
