'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import {
  Users,
  FolderOpen,
  DollarSign,
  Calendar,
  UserCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  FileText,
  Mail,
  TrendingUp,
  Package,
  Store
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    leads: 0,
    projects: 0,
    guests: 0,
    revenue: 0,
    vendors: 0,
    products: 0,
    users: 0,
    websites: 0,
    orders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsData = await api.stats.overview();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    {
      title: 'Active Leads',
      value: stats.leads || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      link: '/dashboard/crm',
      change: '+12%'
    },
    {
      title: 'Projects',
      value: stats.projects || 0,
      icon: FolderOpen,
      color: 'from-purple-500 to-purple-600',
      link: '/dashboard/projects',
      change: '+5%'
    },
    {
      title: 'Total Revenue',
      value: `$${(stats.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      link: '/dashboard/crm',
      change: '+23%'
    },
    {
      title: 'Guest List',
      value: stats.guests || 0,
      icon: UserCheck,
      color: 'from-pink-500 to-pink-600',
      link: '/dashboard/guests',
      change: '+18%'
    }
  ];

  const additionalStats = [
    { title: 'Vendors', value: stats.vendors || 0, icon: Store, color: 'text-orange-600' },
    { title: 'Websites', value: stats.websites || 0, icon: Package, color: 'text-indigo-600' },
    { title: 'Products', value: stats.products || 0, icon: Package, color: 'text-teal-600' },
    { title: 'Orders', value: stats.orders || 0, icon: FileText, color: 'text-rose-600' }
  ];

  const quickActions = [
    { title: 'New Lead', icon: Plus, link: '/dashboard/crm', color: 'blue' },
    { title: 'Create Invoice', icon: FileText, link: '/dashboard/crm', color: 'green' },
    { title: 'Add Guest', icon: UserCheck, link: '/dashboard/guests', color: 'purple' },
    { title: 'New Project', icon: FolderOpen, link: '/dashboard/projects', color: 'pink' }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to your Dashboard! 👋</h1>
          <p className="text-pink-100">Here's an overview of your wedding planning business.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                href={stat.link}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              </Link>
            );
          })}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {additionalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  href={action.link}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  <div className={`w-10 h-10 bg-${action.color}-100 text-${action.color}-600 rounded-lg flex items-center justify-center mb-2`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b">
                <span className="text-gray-600">Total Organizations</span>
                <span className="font-medium text-gray-900">{stats.organizations || 1}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <span className="text-gray-600">Active Users</span>
                <span className="font-medium text-gray-900">{stats.users || 1}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <span className="text-gray-600">Total Projects</span>
                <span className="font-medium text-gray-900">{stats.projects || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-medium text-green-600">${(stats.revenue || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/crm" className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-center">
                <Users size={20} className="mx-auto mb-1 text-gray-600" />
                <span className="text-sm text-gray-700">CRM</span>
              </Link>
              <Link href="/dashboard/projects" className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-center">
                <FolderOpen size={20} className="mx-auto mb-1 text-gray-600" />
                <span className="text-sm text-gray-700">Projects</span>
              </Link>
              <Link href="/dashboard/guests" className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-center">
                <UserCheck size={20} className="mx-auto mb-1 text-gray-600" />
                <span className="text-sm text-gray-700">Guests</span>
              </Link>
              <Link href="/dashboard/vendors" className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-center">
                <Store size={20} className="mx-auto mb-1 text-gray-600" />
                <span className="text-sm text-gray-700">Vendors</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
