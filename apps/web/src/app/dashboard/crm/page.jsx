'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import LeadForm from '@/components/crm/LeadForm';
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
  CheckCircle,
  Clock,
  AlertCircle,
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
  
  // Form states
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingLead, setDeletingLead] = useState(null);

  useEffect(() => {
    fetchCRMData();
  }, [activeTab]);

  const fetchCRMData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'leads':
          const leadsData = await api.crm.leads.list();
          setLeads(Array.isArray(leadsData) ? leadsData : []);
          break;
        case 'proposals':
          const proposalsData = await api.crm.proposals.list();
          setProposals(Array.isArray(proposalsData) ? proposalsData : []);
          break;
        case 'contracts':
          const contractsData = await api.crm.contracts.list();
          setContracts(Array.isArray(contractsData) ? contractsData : []);
          break;
        case 'invoices':
          const invoicesData = await api.crm.invoices.list();
          setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
          break;
      }
    } catch (error) {
      console.error('Failed to fetch CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations for Leads
  const handleCreateLead = async (leadData) => {
    try {
      const newLead = await api.crm.leads.create(leadData);
      if (newLead) {
        setLeads([newLead, ...leads]);
        setShowLeadForm(false);
      }
    } catch (error) {
      console.error('Failed to create lead:', error);
      alert('Failed to create lead. Please try again.');
    }
  };

  const handleUpdateLead = async (leadData) => {
    try {
      const updatedLead = await api.crm.leads.update(editingLead.id, leadData);
      if (updatedLead) {
        setLeads(leads.map(lead => 
          lead.id === editingLead.id ? updatedLead : lead
        ));
        setEditingLead(null);
        setShowLeadForm(false);
      }
    } catch (error) {
      console.error('Failed to update lead:', error);
      alert('Failed to update lead. Please try again.');
    }
  };

  const handleDeleteLead = async () => {
    if (!deletingLead) return;
    
    try {
      await api.crm.leads.delete(deletingLead.id);
      setLeads(leads.filter(lead => lead.id !== deletingLead.id));
      setShowDeleteConfirm(false);
      setDeletingLead(null);
    } catch (error) {
      console.error('Failed to delete lead:', error);
      alert('Failed to delete lead. Please try again.');
    }
  };

  const handleEditClick = (lead) => {
    setEditingLead(lead);
    setShowLeadForm(true);
  };

  const handleDeleteClick = (lead) => {
    setDeletingLead(lead);
    setShowDeleteConfirm(true);
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

  const stats = {
    totalLeads: leads.length,
    activeProposals: proposals.filter(p => p?.status === 'SENT').length,
    signedContracts: contracts.filter(c => c?.status === 'SIGNED').length,
    revenue: invoices.filter(i => i?.status === 'PAID').reduce((sum, i) => sum + (i?.total || 0), 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CRM & Sales</h1>
            <p className="text-gray-500 mt-1">Manage your leads, proposals, and contracts</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={18} className="inline mr-2" />
              Filter
            </button>
            <button 
              onClick={() => {
                setEditingLead(null);
                setShowLeadForm(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
            >
              <Plus size={18} className="inline mr-2" />
              New Lead
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
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
                      onClick={() => {
                        setEditingLead(null);
                        setShowLeadForm(true);
                      }}
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
                          
                          {/* Action Dropdown */}
                          <div className="relative group">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreVertical size={18} className="text-gray-400" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              <button
                                onClick={() => handleEditClick(lead)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <Edit size={16} className="mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(lead)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                              >
                                <Trash2 size={16} className="mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
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

      {/* Lead Form Modal */}
      <LeadForm
        isOpen={showLeadForm}
        onClose={() => {
          setShowLeadForm(false);
          setEditingLead(null);
        }}
        onSubmit={editingLead ? handleUpdateLead : handleCreateLead}
        lead={editingLead}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Lead
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {deletingLead?.firstName} {deletingLead?.lastName}? 
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleDeleteLead}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingLead(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
