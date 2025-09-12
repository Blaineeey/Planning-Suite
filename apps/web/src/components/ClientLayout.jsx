'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import {
  Home,
  Calendar,
  Users,
  Heart,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Clock,
  MapPin,
  Store
} from 'lucide-react';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/client/dashboard', icon: Home },
    { name: 'Timeline', href: '/client/timeline', icon: Clock },
    { name: 'Guest List', href: '/client/guests', icon: Users },
    { name: 'Vendors', href: '/client/vendors', icon: Store },
    { name: 'Budget', href: '/client/budget', icon: DollarSign },
    { name: 'Website', href: '/client/website', icon: Heart },
    { name: 'Documents', href: '/client/documents', icon: FileText },
    { name: 'Settings', href: '/client/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 w-64 bg-white">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href="/client/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RB</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Client Portal</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav className="px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 mb-1 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <Link href="/client/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RB</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Client Portal</span>
            </Link>
          </div>
          
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 mb-1 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-xs">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">Client</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
              
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  Your Wedding Planning Portal
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
