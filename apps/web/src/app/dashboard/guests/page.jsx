'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import useAuthStore from '@/store/authStore';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Download,
  Upload,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Utensils,
  Baby,
  Heart,
  Table as TableIcon,
  MoreVertical
} from 'lucide-react';

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRsvp, setFilterRsvp] = useState('all');
  const [filterSide, setFilterSide] = useState('all');
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [activeTab, setActiveTab] = useState('guests');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchGuests();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const projectsData = await api.projects.list();
      const projectsList = Array.isArray(projectsData) ? projectsData : [];
      setProjects(projectsList);
      if (projectsList.length > 0) {
        setSelectedProject(projectsList[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
    }
  };

  const fetchGuests = async () => {
    if (!selectedProject) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const guestsData = await api.guests.list(selectedProject);
      setGuests(Array.isArray(guestsData) ? guestsData : []);
    } catch (error) {
      console.error('Failed to fetch guests:', error);
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  const getRsvpColor = (status) => {
    switch (status) {
      case 'YES': return 'bg-green-100 text-green-700';
      case 'NO': return 'bg-red-100 text-red-700';
      case 'MAYBE': return 'bg-yellow-100 text-yellow-700';
      case 'PENDING': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSideColor = (side) => {
    switch (side) {
      case 'BRIDE': return 'bg-pink-100 text-pink-700';
      case 'GROOM': return 'bg-blue-100 text-blue-700';
      case 'BOTH': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRsvp = filterRsvp === 'all' || guest.rsvpStatus === filterRsvp;
    const matchesSide = filterSide === 'all' || guest.side === filterSide;
    return matchesSearch && matchesRsvp && matchesSide;
  });

  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.rsvpStatus === 'YES').length,
    declined: guests.filter(g => g.rsvpStatus === 'NO').length,
    pending: guests.filter(g => g.rsvpStatus === 'PENDING').length,
    plusOnes: guests.filter(g => g.plusOne).length,
    meals: {
      beef: guests.filter(g => g.mealSelection === 'Beef').length,
      chicken: guests.filter(g => g.mealSelection === 'Chicken').length,
      fish: guests.filter(g => g.mealSelection === 'Fish').length,
      vegetarian: guests.filter(g => g.mealSelection === 'Vegetarian').length
    }
  };

  const tabs = [
    { id: 'guests', name: 'Guest List', icon: Users },
    { id: 'rsvp', name: 'RSVP Tracking', icon: CheckCircle },
    { id: 'seating', name: 'Seating Chart', icon: TableIcon },
    { id: 'meals', name: 'Meal Preferences', icon: Utensils }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Guest Management</h1>
            <p className="text-gray-500 mt-1">Manage your guest list, RSVPs, and seating arrangements</p>
          </div>
          <div className="flex items-center space-x-3">
            {projects.length > 0 && (
              <select
                value={selectedProject || ''}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            )}
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload size={18} className="inline mr-2" />
              Import
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={18} className="inline mr-2" />
              Export
            </button>
            <button
              onClick={() => alert('Add Guest feature coming soon!')}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
            >
              <Plus size={18} className="inline mr-2" />
              Add Guest
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Guests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Declined</p>
                <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
              </div>
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Plus Ones</p>
                <p className="text-2xl font-bold text-pink-600">{stats.plusOnes}</p>
              </div>
              <Heart size={24} className="text-pink-600" />
            </div>
          </div>
        </div>

        {/* No Project Selected */}
        {!selectedProject && !loading && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Please select a project to view guests</p>
            {projects.length === 0 && (
              <Link
                href="/dashboard/projects"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create a Project First
              </Link>
            )}
          </div>
        )}

        {/* Tabs and Content */}
        {selectedProject && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={18} className="mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {activeTab === 'guests' && (
              <>
                {/* Filters */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search guests..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    <select
                      value={filterRsvp}
                      onChange={(e) => setFilterRsvp(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                    >
                      <option value="all">All RSVP</option>
                      <option value="YES">Confirmed</option>
                      <option value="NO">Declined</option>
                      <option value="MAYBE">Maybe</option>
                      <option value="PENDING">Pending</option>
                    </select>
                    <select
                      value={filterSide}
                      onChange={(e) => setFilterSide(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                    >
                      <option value="all">All Sides</option>
                      <option value="BRIDE">Bride</option>
                      <option value="GROOM">Groom</option>
                      <option value="BOTH">Both</option>
                    </select>
                  </div>
                </div>

                {/* Guest Table */}
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading guests...</p>
                    </div>
                  ) : filteredGuests.length === 0 ? (
                    <div className="text-center py-12">
                      <Users size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No guests found</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedGuests(guests.map(g => g.id));
                                } else {
                                  setSelectedGuests([]);
                                }
                              }}
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            RSVP
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Side
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Plus One
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Meal
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Table
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredGuests.map((guest) => (
                          <tr key={guest.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={selectedGuests.includes(guest.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedGuests([...selectedGuests, guest.id]);
                                  } else {
                                    setSelectedGuests(selectedGuests.filter(id => id !== guest.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-xs font-medium">
                                    {guest.firstName?.[0]}{guest.lastName?.[0]}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {guest.firstName} {guest.lastName}
                                  </p>
                                  {guest.ageGroup === 'CHILD' && (
                                    <span className="text-xs text-gray-500">
                                      <Baby size={12} className="inline mr-1" />
                                      Child
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <p className="text-gray-900">{guest.email}</p>
                                <p className="text-gray-500">{guest.phone}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRsvpColor(guest.rsvpStatus)}`}>
                                {guest.rsvpStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSideColor(guest.side)}`}>
                                {guest.side}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {guest.plusOne ? (
                                <div className="text-sm">
                                  <CheckCircle size={16} className="text-green-600 inline mr-1" />
                                  <span className="text-gray-900">{guest.plusOneName || 'Yes'}</span>
                                </div>
                              ) : (
                                <XCircle size={16} className="text-gray-400" />
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {guest.mealSelection || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {guest.tableId ? `Table ${guest.tableId}` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}

            {/* Other tabs content */}
            {activeTab === 'rsvp' && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">RSVP Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Confirmed</span>
                        <span className="font-medium text-green-600">{stats.confirmed} guests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Declined</span>
                        <span className="font-medium text-red-600">{stats.declined} guests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Pending</span>
                        <span className="font-medium text-yellow-600">{stats.pending} guests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Response Rate</span>
                        <span className="font-medium text-gray-900">
                          {stats.total > 0 ? Math.round(((stats.confirmed + stats.declined) / stats.total) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                        <Send size={16} className="inline mr-2 text-purple-600" />
                        Send RSVP Reminders
                      </button>
                      <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                        <Download size={16} className="inline mr-2 text-purple-600" />
                        Export RSVP Report
                      </button>
                      <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                        <Mail size={16} className="inline mr-2 text-purple-600" />
                        Email Confirmed Guests
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seating' && (
              <div className="p-6 text-center">
                <TableIcon size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Seating chart feature coming soon</p>
                <p className="text-sm text-gray-400">You'll be able to create and manage table arrangements here</p>
              </div>
            )}

            {activeTab === 'meals' && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Beef</span>
                      <span className="font-medium">{stats.meals.beef}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${stats.confirmed > 0 ? (stats.meals.beef / stats.confirmed) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Chicken</span>
                      <span className="font-medium">{stats.meals.chicken}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${stats.confirmed > 0 ? (stats.meals.chicken / stats.confirmed) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Fish</span>
                      <span className="font-medium">{stats.meals.fish}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${stats.confirmed > 0 ? (stats.meals.fish / stats.confirmed) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Vegetarian</span>
                      <span className="font-medium">{stats.meals.vegetarian}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${stats.confirmed > 0 ? (stats.meals.vegetarian / stats.confirmed) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
