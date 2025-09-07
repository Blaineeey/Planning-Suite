'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  Users,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash2,
  Send,
  Home,
  Utensils,
  MapPin
} from 'lucide-react';

export default function GuestsPage() {
  const [activeTab, setActiveTab] = useState('guests');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [guests, setGuests] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [tables, setTables] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRSVP, setFilterRSVP] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchGuestData();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const projectList = data.data || [];
        setProjects(projectList);
        if (projectList.length > 0) {
          setSelectedProject(projectList[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchGuestData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      // Fetch guests
      const guestsResponse = await fetch(`http://localhost:3001/api/projects/${selectedProject}/guests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (guestsResponse.ok) {
        const guestsData = await guestsResponse.json();
        setGuests(guestsData.data?.guests || []);
        setHouseholds(guestsData.data?.households || []);
      }
      
      // Fetch seating
      const seatingResponse = await fetch(`http://localhost:3001/api/projects/${selectedProject}/seating`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (seatingResponse.ok) {
        const seatingData = await seatingResponse.json();
        setTables(seatingData.data?.tables || []);
      }
    } catch (error) {
      console.error('Error fetching guest data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = async (guestData) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:3001/api/projects/${selectedProject}/guests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(guestData)
      });
      
      if (response.ok) {
        fetchGuestData();
        setShowAddGuest(false);
      }
    } catch (error) {
      console.error('Error adding guest:', error);
    }
  };

  const handleDeleteGuest = async (guestId) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:3001/api/guests/${guestId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchGuestData();
      }
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  const getRSVPBadge = (status) => {
    const badges = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'YES': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'NO': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'MAYBE': { color: 'bg-gray-100 text-gray-800', icon: Clock }
    };
    
    const config = badges[status] || badges.PENDING;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.rsvpStatus === 'YES').length,
    declined: guests.filter(g => g.rsvpStatus === 'NO').length,
    pending: guests.filter(g => g.rsvpStatus === 'PENDING').length,
    adults: guests.filter(g => g.ageGroup === 'ADULT').length,
    children: guests.filter(g => g.ageGroup === 'CHILD').length
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRSVP === 'all' || guest.rsvpStatus === filterRSVP;
    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: 'guests', name: 'Guest List', count: guests.length },
    { id: 'rsvp', name: 'RSVP Tracking', count: stats.confirmed },
    { id: 'seating', name: 'Seating Chart', count: tables.length },
    { id: 'meals', name: 'Meal Preferences', count: 0 }
  ];

  if (loading && selectedProject) {
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
              <h1 className="text-3xl font-bold text-gray-900">Guest Management</h1>
              <p className="text-gray-600 mt-1">Manage RSVPs, seating, and guest information</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedProject || ''}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowAddGuest(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
              >
                <UserPlus size={20} className="mr-2" />
                Add Guest
              </button>
            </div>
          </div>
        </div>

        {selectedProject ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Guests</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
                <div className="text-sm text-gray-600">Declined</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.adults}</div>
                <div className="text-sm text-gray-600">Adults</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-purple-600">{stats.children}</div>
                <div className="text-sm text-gray-600">Children</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.name}
                      <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-100 text-xs">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Search and Filter */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search guests..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <select
                      value={filterRSVP}
                      onChange={(e) => setFilterRSVP(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="all">All RSVP</option>
                      <option value="PENDING">Pending</option>
                      <option value="YES">Confirmed</option>
                      <option value="NO">Declined</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                      <Upload size={20} className="mr-2" />
                      Import
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                      <Download size={20} className="mr-2" />
                      Export
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
                      <Send size={20} className="mr-2" />
                      Send RSVPs
                    </button>
                  </div>
                </div>

                {/* Guest List Table */}
                {activeTab === 'guests' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Guest
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            RSVP Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Table
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Meal
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredGuests.map((guest) => (
                          <tr key={guest.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {guest.firstName} {guest.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {guest.side} • {guest.ageGroup}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{guest.email}</div>
                              <div className="text-sm text-gray-500">{guest.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getRSVPBadge(guest.rsvpStatus)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {guest.tableId ? `Table ${guest.tableId}` : 'Not assigned'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {guest.mealSelection || 'Not selected'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-purple-600 hover:text-purple-900 mr-3">
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteGuest(guest.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* RSVP Tracking */}
                {activeTab === 'rsvp' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">RSVP Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Confirmed</span>
                          <span className="font-semibold text-green-600">{stats.confirmed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Declined</span>
                          <span className="font-semibold text-red-600">{stats.declined}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Pending</span>
                          <span className="font-semibold text-yellow-600">{stats.pending}</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Response Rate</span>
                            <span className="font-bold text-gray-900">
                              {stats.total > 0 ? Math.round(((stats.confirmed + stats.declined) / stats.total) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                          Send RSVP Reminders
                        </button>
                        <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          Export RSVP Report
                        </button>
                        <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          Generate RSVP Links
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Seating Chart */}
                {activeTab === 'seating' && (
                  <div>
                    <div className="mb-4">
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Add Table
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tables.map((table) => (
                        <div key={table.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Table {table.number || table.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Capacity: {table.capacity} • Seated: {table.currentSeats || 0}
                          </p>
                          <div className="space-y-1">
                            {guests
                              .filter(g => g.tableId === table.id)
                              .map(guest => (
                                <div key={guest.id} className="text-sm text-gray-700">
                                  {guest.firstName} {guest.lastName}
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No project selected</h3>
            <p className="mt-1 text-sm text-gray-500">Please select a project to manage guests.</p>
          </div>
        )}
      </div>
    </div>
  );
}
