'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MoreVertical,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  ChevronRight,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCRMData();
  }, [activeTab]);

  const fetchCRMData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'leads':
          const leadsData = await api.crm.leads.list();
          setLeads(leadsData);
          break;
        case 'proposals':
          const proposalsData = await api.crm.proposals.list();
          setProposals(proposalsData);
          break;
        case 'contracts':
          const contractsData = await api.crm.contracts.list();
          setContracts(contractsData);
          break;
        case 'invoices':
          const invoicesData = await api.crm.invoices.list();
          setInvoices(invoicesData);
          break;
      }
    } catch (error) {
      console.error('Failed to fetch CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'leads', name: 'Leads', count: leads.length },
    { id: 'proposals', name: 'Proposals', count: proposals.length },
    { id: 'contracts', name: 'Contracts', count: contracts.length },
    { id: 'invoices', name: 'Invoices', count: invoices.length }
  ];

  const getStatusColor = (status) => {
    const colors = {
      NEW: 'bg-blue-100 text-blue-700',
      CONTACTED: 'bg-yellow-100 text-yellow-700',
      QUALIFIED: 'bg-green-100 text-green-700',
      PROPOSAL: 'bg-purple-100 text-purple-700',
      CLOSED_WON: 'bg-green-100 text-green-700',
      CLOSED_LOST: 'bg-red-100 text-red-700',
      DRAFT: 'bg-gray-100 text-gray-700',
      SENT: 'bg-blue-100 text-blue-700',
      VIEWED: 'bg-yellow-100 text-yellow-700',
      ACCEPTED: 'bg-green-100 text-green-700',
      DECLINED: 'bg-red-100 text-red-700',
      SIGNED: 'bg-green-100 text-green-700',
      PAID: 'bg-green-100 text-green-700',
      OVERDUE: 'bg-red-100 text-red-700',
      PARTIAL: 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CRM & Sales</h1>
            <p className="text-gray-500 mt-1">Manage your leads, proposals, and contracts</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Proposals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProposals}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">3 pending review</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Signed Contracts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.signedContracts}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">2 this week</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+23% from last month</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Filter Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              >
                <option value="all">All Status</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="CLOSED_WON">Won</option>
                <option value="CLOSED_LOST">Lost</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading...</p>
              </div>
            ) : activeTab === 'leads' ? (
              <div className="space-y-4">
                {filteredLeads.length === 0 ? (
                  <div className="text-center py-12">
                    <Users size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No leads found</p>
                    <button
                      onClick={() => alert('Add Lead feature coming soon!')}
                      className="mt-4 inline-flex items-center px-4 py-2 text-sm text-purple-600 hover:text-purple-700"
                    >
                      <Plus size={16} className="mr-2" />
                      Add your first lead
                    </button>
                  </div>
                ) : (
                  filteredLeads.map((lead) => (
                    <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {lead.firstName?.[0]}{lead.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {lead.firstName} {lead.lastName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Mail size={14} className="mr-1" />
                                {lead.email}
                              </span>
                              <span className="flex items-center">
                                <Phone size={14} className="mr-1" />
                                {lead.phone}
                              </span>
                              <span className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                {lead.eventDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              ${(lead.budget || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">{lead.guestCount} guests</p>
                          </div>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical size={18} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'proposals' ? (
              <div className="space-y-4">
                {proposals.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No proposals yet</p>
                  </div>
                ) : (
                  proposals.map((proposal) => (
                    <div key={proposal.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{proposal.title}</h3>
                          <p className="text-sm text-gray-500">Proposal #{proposal.number}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                            {proposal.status}
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            ${(proposal.total || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'contracts' ? (
              <div className="space-y-4">
                {contracts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No contracts yet</p>
                  </div>
                ) : (
                  contracts.map((contract) => (
                    <div key={contract.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{contract.title}</h3>
                          <p className="text-sm text-gray-500">Contract #{contract.number}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No invoices yet</p>
                  </div>
                ) : (
                  invoices.map((invoice) => (
                    <div key={invoice.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">Invoice #{invoice.number}</h3>
                          <p className="text-sm text-gray-500">Due: {invoice.dueDate}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            ${(invoice.total || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={18} className="inline mr-2" />
              Filter
            </button>
            <Link
              href="/dashboard/crm/leads/new"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
            >
              <Plus size={18} className="inline mr-2" />
              New Lead
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Proposals</p>
                <p className="text-2xl font-bold text-gray-900">{proposals.filter(p => p.status === 'SENT').length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">3 pending review</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Signed Contracts</p>
                <p className="text-2xl font-bold text-gray-900">{contracts.filter(c => c.status === 'SIGNED').length}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">2 this week</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$124.5k</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+23% from last month</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Filter Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              >
                <option value="all">All Status</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="CLOSED_WON">Won</option>
                <option value="CLOSED_LOST">Lost</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'leads' ? (
              <div className="space-y-4">
                {filteredLeads.length === 0 ? (
                  <div className="text-center py-12">
                    <Users size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No leads found</p>
                  </div>
                ) : (
                  filteredLeads.map((lead) => (
                    <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {lead.firstName?.[0]}{lead.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {lead.firstName} {lead.lastName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Mail size={14} className="mr-1" />
                                {lead.email}
                              </span>
                              <span className="flex items-center">
                                <Phone size={14} className="mr-1" />
                                {lead.phone}
                              </span>
                              <span className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                {lead.eventDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              ${(lead.budget || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">{lead.guestCount} guests</p>
                          </div>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical size={18} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Content for {activeTab} coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="CLOSED_WON">Won</option>
                <option value="CLOSED_LOST">Lost</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading...</p>
              </div>
            ) : activeTab === 'leads' ? (
              <div className="space-y-4">
                {filteredLeads.length === 0 ? (
                  <div className="text-center py-12">
                    <Users size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No leads found</p>
                    <Link
                      href="/dashboard/crm/leads/new"
                      className="mt-4 inline-flex items-center px-4 py-2 text-sm text-purple-600 hover:text-purple-700"
                    >
                      <Plus size={16} className="mr-2" />
                      Add your first lead
                    </Link>
                  </div>
                ) : (
                  filteredLeads.map((lead) => (
                    <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {lead.firstName?.[0]}{lead.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {lead.firstName} {lead.lastName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Mail size={14} className="mr-1" />
                                {lead.email}
                              </span>
                              <span className="flex items-center">
                                <Phone size={14} className="mr-1" />
                                {lead.phone}
                              </span>
                              <span className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                {lead.eventDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              ${(lead.budget || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">{lead.guestCount} guests</p>
                          </div>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical size={18} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Content for {activeTab} coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
