'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import useAuthStore from '@/store/authStore';
import { 
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Heart,
  MapPin,
  DollarSign,
  FileText,
  Camera,
  Music,
  Flower,
  Cake,
  AlertCircle
} from 'lucide-react';

export default function ClientDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and is a client
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'CLIENT') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    // Fetch client's project data
    fetchProjectData();
  }, []);

  const fetchProjectData = async () => {
    // Simulated data - replace with actual API call
    setProject({
      name: 'Sarah & John Wedding',
      eventDate: '2025-07-15',
      daysUntil: 214,
      venue: 'Sunset Gardens, Beverly Hills',
      guestCount: 150,
      budget: 60000,
      spent: 25000,
      tasks: {
        total: 24,
        completed: 12,
        upcoming: 8,
        overdue: 4
      },
      vendors: [
        { category: 'Photography', name: 'Elite Photography', status: 'Booked', icon: Camera },
        { category: 'Catering', name: 'Gourmet Delights', status: 'Confirmed', icon: Cake },
        { category: 'Florist', name: 'Bloom & Blossom', status: 'Pending', icon: Flower },
        { category: 'Music', name: 'DJ Masters', status: 'Booked', icon: Music }
      ],
      recentActivity: [
        { action: 'Venue payment confirmed', time: '2 hours ago', type: 'payment' },
        { action: 'Guest RSVP received from Emily Smith', time: '5 hours ago', type: 'rsvp' },
        { action: 'Photographer contract signed', time: '1 day ago', type: 'contract' },
        { action: 'Menu tasting scheduled', time: '2 days ago', type: 'task' }
      ]
    });
    setLoading(false);
  };

  if (!isAuthenticated || user?.role !== 'CLIENT') {
    return null;
  }

  const quickActions = [
    { label: 'View Guest List', icon: Users, href: '/client/guests', color: 'bg-blue-500' },
    { label: 'Wedding Website', icon: Heart, href: '/client/website', color: 'bg-pink-500' },
    { label: 'Timeline', icon: Clock, href: '/client/timeline', color: 'bg-purple-500' },
    { label: 'Budget Tracker', icon: DollarSign, href: '/client/budget', color: 'bg-green-500' }
  ];

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}! 💕
          </h1>
          <p className="text-white/90 text-lg">
            Your wedding is in {project?.daysUntil} days
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="text-white/80" size={24} />
                <div>
                  <p className="text-white/80 text-sm">Event Date</p>
                  <p className="text-white font-semibold">{project?.eventDate}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="text-white/80" size={24} />
                <div>
                  <p className="text-white/80 text-sm">Venue</p>
                  <p className="text-white font-semibold">{project?.venue}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Users className="text-white/80" size={24} />
                <div>
                  <p className="text-white/80 text-sm">Guests</p>
                  <p className="text-white font-semibold">{project?.guestCount} invited</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => router.push(action.href)}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <p className="text-gray-900 font-medium">{action.label}</p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Overview */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Progress</h2>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{project?.tasks.completed} completed</span>
                <span>{project?.tasks.total} total</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full"
                  style={{ width: `${(project?.tasks.completed / project?.tasks.total) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-900">{project?.tasks.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="text-blue-600 mx-auto mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-900">{project?.tasks.upcoming}</p>
                <p className="text-sm text-gray-600">Upcoming</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertCircle className="text-red-600 mx-auto mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-900">{project?.tasks.overdue}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={() => router.push('/client/tasks')}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View All Tasks →
              </button>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Spent</span>
                  <span>${project?.spent?.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(project?.spent / project?.budget) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total Budget</span>
                  <span className="font-semibold">${project?.budget?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Spent</span>
                  <span className="text-green-600">-${project?.spent?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="font-medium">Remaining</span>
                  <span className="font-bold text-lg">
                    ${(project?.budget - project?.spent)?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => router.push('/client/budget')}
              className="w-full mt-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Manage Budget →
            </button>
          </div>
        </div>

        {/* Vendors & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendors */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Vendors</h2>
            <div className="space-y-3">
              {project?.vendors.map((vendor, index) => {
                const Icon = vendor.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icon size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{vendor.name}</p>
                        <p className="text-sm text-gray-500">{vendor.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      vendor.status === 'Booked' ? 'bg-green-100 text-green-700' :
                      vendor.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {vendor.status}
                    </span>
                  </div>
                );
              })}
            </div>
            <button 
              onClick={() => router.push('/client/vendors')}
              className="w-full mt-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View All Vendors →
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {project?.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'payment' ? 'bg-green-500' :
                    activity.type === 'rsvp' ? 'bg-blue-500' :
                    activity.type === 'contract' ? 'bg-purple-500' :
                    'bg-gray-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => router.push('/client/activity')}
              className="w-full mt-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View All Activity →
            </button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
