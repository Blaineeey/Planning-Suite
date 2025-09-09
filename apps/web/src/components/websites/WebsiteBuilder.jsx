import { useState } from 'react';
import { Globe, Palette, Heart, Calendar, MapPin, Image, Type, Layout } from 'lucide-react';

export default function WebsiteBuilder({ project, website, onSave }) {
  const [activeSection, setActiveSection] = useState('general');
  const [websiteData, setWebsiteData] = useState({
    subdomain: website?.subdomain || '',
    template: website?.template || 'elegant',
    primaryColor: website?.primaryColor || '#E91E63',
    secondaryColor: website?.secondaryColor || '#9C27B0',
    // Content sections
    heroTitle: website?.heroTitle || `${project?.clientName || 'Our'} Wedding`,
    heroSubtitle: website?.heroSubtitle || 'Join us for our special day',
    heroImage: website?.heroImage || '',
    // Our Story
    storyTitle: website?.storyTitle || 'Our Story',
    storyContent: website?.storyContent || '',
    brideStory: website?.brideStory || '',
    groomStory: website?.groomStory || '',
    // Event Details
    ceremonyLocation: website?.ceremonyLocation || project?.venue?.name || '',
    ceremonyAddress: website?.ceremonyAddress || project?.venue?.address || '',
    ceremonyTime: website?.ceremonyTime || '',
    receptionLocation: website?.receptionLocation || '',
    receptionAddress: website?.receptionAddress || '',
    receptionTime: website?.receptionTime || '',
    // RSVP Settings
    rsvpEnabled: website?.rsvpEnabled !== false,
    rsvpDeadline: website?.rsvpDeadline || '',
    // Gallery
    galleryImages: website?.galleryImages || [],
    // Registry
    registryEnabled: website?.registryEnabled !== false,
    registryLinks: website?.registryLinks || [],
    // Accommodations
    accommodations: website?.accommodations || [],
    // FAQs
    faqs: website?.faqs || [],
    isPublished: website?.isPublished || false
  });

  const templates = [
    { id: 'elegant', name: 'Elegant', preview: '🌸' },
    { id: 'modern', name: 'Modern', preview: '✨' },
    { id: 'rustic', name: 'Rustic', preview: '🌿' },
    { id: 'beach', name: 'Beach', preview: '🏖️' },
    { id: 'garden', name: 'Garden', preview: '🌺' },
    { id: 'classic', name: 'Classic', preview: '💐' }
  ];

  const sections = [
    { id: 'general', name: 'General', icon: Layout },
    { id: 'hero', name: 'Hero Section', icon: Image },
    { id: 'story', name: 'Our Story', icon: Heart },
    { id: 'event', name: 'Event Details', icon: Calendar },
    { id: 'location', name: 'Location', icon: MapPin },
    { id: 'gallery', name: 'Gallery', icon: Image },
    { id: 'registry', name: 'Registry', icon: Heart },
    { id: 'accommodations', name: 'Accommodations', icon: MapPin },
    { id: 'faq', name: 'FAQ', icon: Type }
  ];

  const handleChange = (field, value) => {
    setWebsiteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(websiteData);
  };

  const getPreviewUrl = () => {
    return `https://${websiteData.subdomain || 'preview'}.rubanbleu.com`;
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Website Builder</h3>
          <p className="text-sm text-gray-500 mt-1">{project?.name}</p>
        </div>
        <nav className="p-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} className="mr-3" />
                {section.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">https://</span>
                  <input
                    type="text"
                    value={websiteData.subdomain}
                    onChange={(e) => handleChange('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    placeholder="john-and-jane"
                  />
                  <span className="text-gray-500 ml-2">.rubanbleu.com</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Preview: {getPreviewUrl()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleChange('template', template.id)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        websiteData.template === template.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{template.preview}</div>
                      <div className="text-sm font-medium text-gray-900">{template.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={websiteData.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="h-10 w-20"
                    />
                    <input
                      type="text"
                      value={websiteData.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={websiteData.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="h-10 w-20"
                    />
                    <input
                      type="text"
                      value={websiteData.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hero Section */}
          {activeSection === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={websiteData.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  placeholder="John & Jane's Wedding"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={websiteData.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  placeholder="Join us for our special day"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  value={websiteData.heroImage}
                  onChange={(e) => handleChange('heroImage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  placeholder="https://example.com/hero-image.jpg"
                />
              </div>
            </div>
          )}

          {/* Our Story */}
          {activeSection === 'story' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Our Story</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title
                </label>
                <input
                  type="text"
                  value={websiteData.storyTitle}
                  onChange={(e) => handleChange('storyTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  placeholder="Our Story"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How We Met
                </label>
                <textarea
                  value={websiteData.storyContent}
                  onChange={(e) => handleChange('storyContent', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  placeholder="Tell your love story..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About the Bride
                  </label>
                  <textarea
                    value={websiteData.brideStory}
                    onChange={(e) => handleChange('brideStory', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    placeholder="About the bride..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About the Groom
                  </label>
                  <textarea
                    value={websiteData.groomStory}
                    onChange={(e) => handleChange('groomStory', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    placeholder="About the groom..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Event Details */}
          {activeSection === 'event' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Event Details</h2>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Ceremony</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={websiteData.ceremonyLocation}
                      onChange={(e) => handleChange('ceremonyLocation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                      placeholder="Church Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      value={websiteData.ceremonyTime}
                      onChange={(e) => handleChange('ceremonyTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                      placeholder="3:00 PM"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={websiteData.ceremonyAddress}
                    onChange={(e) => handleChange('ceremonyAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Reception</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={websiteData.receptionLocation}
                      onChange={(e) => handleChange('receptionLocation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                      placeholder="Reception Venue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      value={websiteData.receptionTime}
                      onChange={(e) => handleChange('receptionTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                      placeholder="5:00 PM"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={websiteData.receptionAddress}
                    onChange={(e) => handleChange('receptionAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="456 Oak Ave, City, State"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">RSVP Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rsvpEnabled"
                      checked={websiteData.rsvpEnabled}
                      onChange={(e) => handleChange('rsvpEnabled', e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rsvpEnabled" className="ml-2 text-sm text-gray-700">
                      Enable Online RSVP
                    </label>
                  </div>
                  
                  {websiteData.rsvpEnabled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        RSVP Deadline
                      </label>
                      <input
                        type="date"
                        value={websiteData.rsvpDeadline}
                        onChange={(e) => handleChange('rsvpDeadline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => handleChange('isPublished', !websiteData.isPublished)}
                className={`px-6 py-2 rounded-lg ${
                  websiteData.isPublished
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {websiteData.isPublished ? 'Unpublish' : 'Publish'}
              </button>
            </div>
            
            <a
              href={getPreviewUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Globe size={18} className="mr-2" />
              Preview Site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
