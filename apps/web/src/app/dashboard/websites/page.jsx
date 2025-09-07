'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Globe,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Lock,
  Unlock,
  Palette,
  Image,
  FileText,
  Calendar,
  MapPin,
  Gift,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';

export default function WebsitesPage() {
  const [projects, setProjects] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showCreateWebsite, setShowCreateWebsite] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchWebsiteData();
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

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/website-templates', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchWebsiteData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`http://localhost:3001/api/projects/${selectedProject}/website`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWebsites([data.data]);
      } else {
        setWebsites([]);
      }
    } catch (error) {
      console.error('Error fetching website:', error);
      setWebsites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebsite = async (websiteData) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:3001/api/projects/${selectedProject}/website`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(websiteData)
      });
      
      if (response.ok) {
        fetchWebsiteData();
        setShowCreateWebsite(false);
      }
    } catch (error) {
      console.error('Error creating website:', error);
    }
  };

  const handlePublishWebsite = async (websiteId) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:3001/api/websites/${websiteId}/publish`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchWebsiteData();
      }
    } catch (error) {
      console.error('Error publishing website:', error);
    }
  };

  const website = websites[0];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Globe },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'content', name: 'Content', icon: FileText },
    { id: 'rsvp', name: 'RSVP Settings', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
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
              <h1 className="text-3xl font-bold text-gray-900">Wedding Websites</h1>
              <p className="text-gray-600 mt-1">Create and manage wedding websites for your clients</p>
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
              {!website && selectedProject && (
                <button
                  onClick={() => setShowCreateWebsite(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
                >
                  <Plus size={20} className="mr-2" />
                  Create Website
                </button>
              )}
            </div>
          </div>
        </div>

        {selectedProject && website ? (
          <>
            {/* Website Status Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{website.subdomain}.rubanbleu.com</h2>
                    <div className="flex items-center mt-1 space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        website.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {website.isPublished ? (
                          <>
                            <CheckCircle size={12} className="mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <XCircle size={12} className="mr-1" />
                            Draft
                          </>
                        )}
                      </span>
                      <span className="text-sm text-gray-500">
                        Privacy: {website.privacy}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <a
                    href={website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <Eye size={18} className="mr-2" />
                    Preview
                  </a>
                  {!website.isPublished ? (
                    <button
                      onClick={() => handlePublishWebsite(website.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <Unlock size={18} className="mr-2" />
                      Publish
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center">
                      <Lock size={18} className="mr-2" />
                      Unpublish
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
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

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">URL</span>
                          <a href={website.url} className="text-purple-600 hover:text-purple-700">
                            {website.url}
                          </a>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Template</span>
                          <span className="text-gray-900">{website.templateId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">RSVP Enabled</span>
                          <span className="text-gray-900">{website.rsvpEnabled ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">RSVP Deadline</span>
                          <span className="text-gray-900">
                            {website.rsvpDeadline ? new Date(website.rsvpDeadline).toLocaleDateString() : 'Not set'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pages</h3>
                      <div className="space-y-2">
                        {website.pages?.map((page) => (
                          <div key={page} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700 capitalize">{page.replace('-', ' ')}</span>
                            <button className="text-purple-600 hover:text-purple-700">
                              <Edit size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Design Tab */}
                {activeTab === 'design' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Settings</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-10 h-10 rounded border border-gray-300"
                            style={{ backgroundColor: website.theme?.primaryColor }}
                          />
                          <input
                            type="text"
                            value={website.theme?.primaryColor}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-10 h-10 rounded border border-gray-300"
                            style={{ backgroundColor: website.theme?.secondaryColor }}
                          />
                          <input
                            type="text"
                            value={website.theme?.secondaryColor}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Templates</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {templates.map((template) => (
                        <div key={template.id} className={`border-2 rounded-lg p-4 cursor-pointer ${
                          website.templateId === template.id ? 'border-purple-500' : 'border-gray-200'
                        }`}>
                          <div className="h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded mb-2"></div>
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.style}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Couple Names</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Partner 1"
                          value={website.coupleNames?.person1}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Partner 2"
                          value={website.coupleNames?.person2}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Story</h3>
                      <textarea
                        rows={4}
                        placeholder="Tell your love story..."
                        value={website.story}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Save Content
                    </button>
                  </div>
                )}

                {/* RSVP Tab */}
                {activeTab === 'rsvp' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">RSVP Status</h3>
                        <p className="text-sm text-gray-600">Allow guests to RSVP through the website</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={website.rsvpEnabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    {website.rsvpEnabled && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">RSVP Deadline</label>
                          <input
                            type="date"
                            value={website.rsvpDeadline?.split('T')[0]}
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">RSVP Form Fields</h3>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span className="text-sm text-gray-700">Guest Name</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span className="text-sm text-gray-700">Email</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span className="text-sm text-gray-700">Meal Selection</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span className="text-sm text-gray-700">Dietary Restrictions</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" className="mr-2" />
                              <span className="text-sm text-gray-700">Plus One</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Traffic</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Page Views</span>
                          <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unique Visitors</span>
                          <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">RSVP Submissions</span>
                          <span className="font-semibold">0</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
                      <p className="text-gray-500">No data available yet</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : selectedProject && !website ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Website Created</h3>
            <p className="text-gray-500 mb-6">Create a beautiful wedding website for this project</p>
            <button
              onClick={() => setShowCreateWebsite(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus size={20} className="mr-2" />
              Create Website
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No project selected</h3>
            <p className="mt-1 text-sm text-gray-500">Please select a project to manage its website.</p>
          </div>
        )}
      </div>
    </div>
  );
}
