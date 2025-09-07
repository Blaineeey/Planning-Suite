'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  TrendingUp,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [pipelineStages, setPipelineStages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    fetchCRMData();
  }, [activeTab]);

  const fetchCRMData = async () => {
    try {
      setLoading(true);
      
      // Fetch pipeline stages
      const stagesResponse = await api.crm.pipelineStages();
      setPipelineStages(stagesResponse.data || []);
      
      // Fetch data based on active tab
      switch (activeTab) {
        case 'leads':
          const leadsResponse = await api.crm.leads.list();
          setLeads(leadsResponse.data || []);
          break;
        case 'proposals':
          const proposalsResponse = await api.crm.proposals.list();
          setProposals(proposalsResponse.data || []);
          break;
        case 'contracts':
          const contractsResponse = await api.crm.contracts.list();
          setContracts(contractsResponse.data || []);
          break;
        case 'invoices':
          const invoicesResponse = await api.crm.invoices.list();
          setInvoices(invoicesResponse.data || []);
          break;
      }
    } catch (error) {
      console.error('Error fetching CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertLead = async (leadId) => {
    try {
      await api.crm.leads.convert(leadId, { createProject: true });
      fetchCRMData();
    } catch (error) {
      console.error('Error converting lead:', error);
    }
  };

  const handleSendProposal = async (proposalId) => {
    try {
      await api.crm.proposals.send(proposalId);
      fetchCRMData();
    } catch (error) {
      console.error('Error sending proposal:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      NEW: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      CONTACTED: { color: 'bg-blue-100 text-blue-800', icon: Mail },
      QUALIFIED: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
      PROPOSAL: { color: 'bg-orange-100 text-orange-800', icon: FileText },
      NEGOTIATION: { color: 'bg-pink-100 text-pink-800', icon: TrendingUp },
      CLOSED_WON: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CLOSED_LOST: { color: 'bg-red-100 text-red-800', icon: XCircle },
      DRAFT: { color: 'bg-gray-100 text-gray-800', icon: FileText },
      SENT: { color: 'bg-blue-100 text-blue-800', icon: Mail },
      VIEWED: { color: 'bg-purple-100 text-purple-800', icon: Eye },
      ACCEPTED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      DECLINED: { color: 'bg-red-100 text-red-800', icon: XCircle },
      SIGNED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      PAID: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      PARTIAL: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      OVERDUE: { color: 'bg-red-100 text-red-800', icon: Clock }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: Clock };
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  const tabs = [
    { id: 'leads', name: 'Leads', count: leads.length },
    { id: 'proposals', name: 'Proposals', count: proposals.length },
    { id: 'contracts', name: 'Contracts', count: contracts.length },
    { id: 'invoices', name: 'Invoices', count: invoices.length }
  ];

  const renderLeadsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Budget
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {lead.firstName} {lead.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{lead.email}</div>
                  <div className="text-sm text-gray-500">{lead.phone}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(lead.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{lead.eventType || 'Not specified'}</div>
                <div className="text-sm text-gray-500">
                  {lead.eventDate ? new Date(lead.eventDate).toLocaleDateString() : 'No date'}
                </div>
                <div className="text-sm text-gray-500">{lead.guestCount || 0} guests</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  ${(lead.budget || 0).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{lead.source || 'Direct'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setShowDropdown(showDropdown === lead.id ? null : lead.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {showDropdown === lead.id && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <Link
                          href={`/dashboard/crm/leads/${lead.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="inline mr-2" size={16} />
                          View Details
                        </Link>
                        <Link
                          href={`/dashboard/crm/leads/${lead.id}/edit`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="inline mr-2" size={16} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleConvertLead(lead.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Users className="inline mr-2" size={16} />
                          Convert to Client
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <Trash2 className="inline mr-2" size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProposalsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Proposal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valid Until
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {proposals.map((proposal) => (
            <tr key={proposal.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{proposal.title}</div>
                <div className="text-sm text-gray-500">{proposal.number}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(proposal.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  ${(proposal.total || 0).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {proposal.validUntil ? new Date(proposal.validUntil).toLocaleDateString() : 'No expiry'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {proposal.status === 'DRAFT' && (
                  <button
                    onClick={() => handleSendProposal(proposal.id)}
                    className="text-purple-600 hover:text-purple-900 mr-2"
                  >
                    Send
                  </button>
                )}
                <Link href={`/dashboard/crm/proposals/${proposal.id}`} className="text-purple-600 hover:text-purple-900">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContractsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contract
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Signed Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contracts.map((contract) => (
            <tr key={contract.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                <div className="text-sm text-gray-500">{contract.number}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(contract.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {contract.signedAt ? new Date(contract.signedAt).toLocaleDateString() : 'Not signed'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/dashboard/crm/contracts/${contract.id}`} className="text-purple-600 hover:text-purple-900">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderInvoicesTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoice
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(invoice.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  ${(invoice.total || 0).toLocaleString()}
                </div>
                {invoice.balance > 0 && (
                  <div className="text-xs text-gray-500">
                    Balance: ${invoice.balance.toLocaleString()}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'No due date'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/dashboard/crm/invoices/${invoice.id}`} className="text-purple-600 hover:text-purple-900">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
            <p className="text-gray-600">Manage leads, proposals, contracts, and invoices</p>
          </div>
          <Link
            href={`/dashboard/crm/${activeTab}/new`}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
          >
            <Plus size={20} className="mr-2" />
            Add New
          </Link>
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

          {/* Content */}
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
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter size={20} className="mr-2" />
                  Filter
                </button>
              </div>
            </div>

            {/* Tables */}
            {activeTab === 'leads' && renderLeadsTable()}
            {activeTab === 'proposals' && renderProposalsTable()}
            {activeTab === 'contracts' && renderContractsTable()}
            {activeTab === 'invoices' && renderInvoicesTable()}

            {/* Empty State */}
            {((activeTab === 'leads' && leads.length === 0) ||
              (activeTab === 'proposals' && proposals.length === 0) ||
              (activeTab === 'contracts' && contracts.length === 0) ||
              (activeTab === 'invoices' && invoices.length === 0)) && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No {activeTab} found</p>
                <Link
                  href={`/dashboard/crm/${activeTab}/new`}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus size={20} className="mr-2" />
                  Add First {activeTab.slice(0, -1)}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
