'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  FolderOpen,
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Plus,
  Eye,
  Edit,
  UserCheck,
  Globe,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Bell,
  Home,
  Store,
  Settings,
  BarChart3
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    organizations: 0,
    users: 0,
    projects: 0,
    leads: 0,
    guests: 0,
    vendors: 0,
    websites: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchDashboardData(token);
  }, []);

  const fetchDashboardData = async (token) => {
    try {
      setLoading(true);
      
      // Fetch overview stats
      const statsResponse = await fetch('http://localhost:3001/api/stats/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
      
      // Fetch recent projects
      const projectsResponse = await fetch('http://localhost:3001/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setRecentProjects(projectsData.data?.slice(0, 5) || []);
      }
      
      // Fetch recent leads
      const leadsResponse = await fetch('http://localhost:3001/api/crm/leads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        setRecentLeads(leadsData.data?.slice(0, 5) || []);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'CRM', href: '/dashboard/crm', icon: Users },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
    { name: 'Guests', href: '/dashboard/guests', icon: UserCheck },
    { name: 'Vendors', href: '/dashboard/vendors', icon: Store },
    { name: 'Websites', href: '/dashboard/websites', icon: Globe },
    { name: 'Shop', href: '/dashboard/shop', icon: ShoppingBag },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const statCards = [
    {
      title: 'Active Projects',
      value: stats.projects || 0,
      change: '+12%',
      trend: 'up',
      icon: FolderOpen,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      link: '/dashboard/projects'
    },
    {
      title: 'Total Leads',
      value: stats.leads || 0,
      change: '+23%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      link: '/dashboard/crm'
    },
    {
      title: 'Revenue',
      value: `$${(stats.revenue || 0).toLocaleString()}`,
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      link: '/dashboard/reports'
    },
    {
      title: 'Guest RSVPs',
      value: stats.guests || 0,
      change: '+45%',
      trend: 'up',
      icon: UserCheck,
      color: 'bg-pink-500',
      lightColor: 'bg-pink-100',
      link: '/dashboard/guests'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'PLANNING': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-gray-100 text-gray-800',
      'NEW': 'bg-yellow-100 text-yellow-800',
      'PROPOSAL': 'bg-purple-100 text-purple-800',
      'CONTRACTED': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } fixed inset-y-0 left-0 z-40 transition-all duration-300 bg-white border-r border-gray-200`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RB</span>
              </div>
              {sidebarOpen && (
                <span className="text-xl font-bold text-gray-900">Ruban Bleu</span>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <Icon size={20} />
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="px-4 py-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Bell size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Calendar size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
              </h1>
              <p className="text-white/90">Here's what's happening with your wedding planning business today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${stat.lightColor} p-3 rounded-lg`}>
                        <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                        {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Rest of the dashboard content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
                </div>
                <div className="p-6">
                  {recentProjects.length > 0 ? (
                    <div className="space-y-4">
                      {recentProjects.map((project) => (
                        <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {project.eventDate ? new Date(project.eventDate).toLocaleDateString() : 'No date set'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No projects yet</p>
                  )}
                </div>
              </div>

              {/* Recent Leads */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
                </div>
                <div className="p-6">
                  {recentLeads.length > 0 ? (
                    <div className="space-y-4">
                      {recentLeads.map((lead) => (
                        <div key={lead.id} className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</h3>
                          <p className="text-sm text-gray-600 mt-1">{lead.email}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No leads yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
