const db = require('../../models/database');
const crypto = require('crypto');

class WebsiteGeneratorService {
  constructor() {
    this.templates = {
      elegant: {
        name: 'Elegant',
        description: 'Classic and timeless design with sophisticated typography',
        features: ['Hero section', 'Our Story', 'Event Details', 'RSVP', 'Registry', 'Gallery'],
        colorSchemes: [
          { primary: '#2C3E50', secondary: '#ECF0F1', accent: '#E74C3C' },
          { primary: '#34495E', secondary: '#BDC3C7', accent: '#3498DB' }
        ]
      },
      modern: {
        name: 'Modern',
        description: 'Clean, minimalist design with bold typography',
        features: ['Full-screen hero', 'Timeline', 'Interactive RSVP', 'Map integration', 'Social feed'],
        colorSchemes: [
          { primary: '#000000', secondary: '#FFFFFF', accent: '#FF6B6B' },
          { primary: '#1A1A1A', secondary: '#F5F5F5', accent: '#4ECDC4' }
        ]
      },
      rustic: {
        name: 'Rustic',
        description: 'Warm, countryside feel with natural textures',
        features: ['Wood textures', 'Handwritten fonts', 'Photo collage', 'Guest book', 'Directions'],
        colorSchemes: [
          { primary: '#8B4513', secondary: '#FFF8DC', accent: '#228B22' },
          { primary: '#A0522D', secondary: '#FAF0E6', accent: '#FF8C00' }
        ]
      },
      romantic: {
        name: 'Romantic',
        description: 'Soft, dreamy design with floral elements',
        features: ['Floral borders', 'Script fonts', 'Love story timeline', 'Photo gallery', 'RSVP cards'],
        colorSchemes: [
          { primary: '#FFB6C1', secondary: '#FFF0F5', accent: '#FF69B4' },
          { primary: '#DDA0DD', secondary: '#E6E6FA', accent: '#9370DB' }
        ]
      },
      beach: {
        name: 'Beach',
        description: 'Coastal vibes with ocean-inspired elements',
        features: ['Wave animations', 'Beach imagery', 'Weather widget', 'Travel info', 'Activities'],
        colorSchemes: [
          { primary: '#006994', secondary: '#F0F8FF', accent: '#FFD700' },
          { primary: '#4682B4', secondary: '#E0FFFF', accent: '#FF7F50' }
        ]
      }
    };
  }

  /**
   * Generate a new wedding website
   */
  async generateWebsite(projectId, config = {}) {
    const project = db.findById('projects', projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }

    // Generate unique subdomain if not provided
    const subdomain = config.subdomain || this.generateSubdomain(project.name);
    
    // Check if subdomain is available
    const existing = db.findAll('weddingWebsites', { subdomain });
    if (existing.length > 0) {
      throw new Error('Subdomain already taken');
    }

    // Get template configuration
    const template = this.templates[config.template || 'elegant'];
    const colorScheme = config.colorScheme || template.colorSchemes[0];

    // Create website record
    const website = db.create('weddingWebsites', {
      projectId,
      organizationId: project.organizationId,
      subdomain,
      url: `https://weddings.rubanbleu.com/${subdomain}`,
      template: config.template || 'elegant',
      theme: {
        ...colorScheme,
        fontFamily: config.fontFamily || 'Playfair Display',
        backgroundStyle: config.backgroundStyle || 'gradient'
      },
      coupleNames: config.coupleNames || {
        person1: project.clientName?.split(' & ')[0] || 'Partner 1',
        person2: project.clientName?.split(' & ')[1] || 'Partner 2'
      },
      heroTitle: config.heroTitle || `${project.clientName || 'We\'re'} Getting Married!`,
      heroSubtitle: config.heroSubtitle || this.formatEventDate(project.eventDate),
      heroImage: config.heroImage || null,
      storyTitle: config.storyTitle || 'Our Love Story',
      storyContent: config.storyContent || 'Our journey together began...',
      eventDetails: {
        date: project.eventDate,
        ceremonyTime: config.ceremonyTime || '4:00 PM',
        receptionTime: config.receptionTime || '6:00 PM',
        venue: project.venue || {},
        dresscode: config.dresscode || 'Formal'
      },
      pages: template.features.map(f => this.featureToPage(f)),
      sections: this.generateSections(template, config),
      rsvpEnabled: config.rsvpEnabled !== false,
      rsvpDeadline: config.rsvpDeadline || this.calculateRsvpDeadline(project.eventDate),
      registryEnabled: config.registryEnabled !== false,
      registryLinks: config.registryLinks || [],
      galleryImages: config.galleryImages || [],
      isPublished: false,
      privacy: config.privacy || 'PUBLIC',
      password: config.privacy === 'PASSWORD' ? this.generatePassword() : null,
      customDomain: config.customDomain || null,
      analytics: {
        views: 0,
        uniqueVisitors: 0,
        rsvpSubmissions: 0
      },
      seo: {
        title: config.seoTitle || `${project.clientName} Wedding`,
        description: config.seoDescription || `Join us for our wedding celebration on ${this.formatEventDate(project.eventDate)}`,
        keywords: config.seoKeywords || 'wedding, celebration, rsvp',
        ogImage: config.ogImage || config.heroImage
      }
    });

    // Generate default content for each section
    await this.generateDefaultContent(website.id);

    return website;
  }

  /**
   * Generate default content for website sections
   */
  async generateDefaultContent(websiteId) {
    const website = db.findById('weddingWebsites', websiteId);
    const project = db.findById('projects', website.projectId);

    const defaultSections = {
      hero: {
        content: {
          title: website.heroTitle,
          subtitle: website.heroSubtitle,
          scrollText: 'Scroll to learn more',
          backgroundType: 'image', // image, video, gradient
          overlay: true,
          overlayOpacity: 0.3
        }
      },
      story: {
        content: {
          title: 'Our Story',
          subtitle: 'How it all began',
          chapters: [
            {
              title: 'First Meeting',
              date: 'Date',
              content: 'Tell your story here...',
              image: null
            },
            {
              title: 'First Date',
              date: 'Date',
              content: 'Share your memories...',
              image: null
            },
            {
              title: 'The Proposal',
              date: 'Date',
              content: 'The magical moment...',
              image: null
            }
          ]
        }
      },
      schedule: {
        content: {
          title: 'Wedding Schedule',
          events: [
            {
              time: '3:30 PM',
              title: 'Guest Arrival',
              description: 'Guests begin arriving',
              location: 'Main Entrance'
            },
            {
              time: website.eventDetails.ceremonyTime,
              title: 'Ceremony',
              description: 'Exchange of vows',
              location: 'Garden'
            },
            {
              time: '5:00 PM',
              title: 'Cocktail Hour',
              description: 'Drinks and appetizers',
              location: 'Terrace'
            },
            {
              time: website.eventDetails.receptionTime,
              title: 'Reception',
              description: 'Dinner and dancing',
              location: 'Ballroom'
            }
          ]
        }
      },
      venue: {
        content: {
          title: 'Venue & Location',
          ceremonyVenue: {
            name: project.venue?.name || 'Ceremony Venue',
            address: project.venue?.address || 'Address',
            image: null,
            mapUrl: null,
            directions: 'Directions and parking information...'
          },
          receptionVenue: {
            name: project.venue?.name || 'Reception Venue',
            address: project.venue?.address || 'Address',
            image: null,
            mapUrl: null,
            directions: 'Directions and parking information...'
          }
        }
      },
      rsvp: {
        content: {
          title: 'RSVP',
          subtitle: `Please respond by ${this.formatEventDate(website.rsvpDeadline)}`,
          message: 'We can\'t wait to celebrate with you!',
          fields: [
            { name: 'fullName', label: 'Full Name', required: true },
            { name: 'email', label: 'Email', required: true },
            { name: 'attending', label: 'Will you attend?', type: 'radio', required: true },
            { name: 'guestCount', label: 'Number of guests', type: 'number', max: 2 },
            { name: 'mealPreference', label: 'Meal preference', type: 'select', options: ['Beef', 'Chicken', 'Fish', 'Vegetarian'] },
            { name: 'dietaryRestrictions', label: 'Dietary restrictions', type: 'textarea' },
            { name: 'message', label: 'Message for the couple', type: 'textarea' }
          ]
        }
      },
      registry: {
        content: {
          title: 'Gift Registry',
          subtitle: 'Your presence is the greatest gift',
          message: 'If you wish to honor us with a gift, we\'ve registered at the following stores:',
          links: website.registryLinks || []
        }
      },
      gallery: {
        content: {
          title: 'Photo Gallery',
          subtitle: 'Our memories together',
          albums: [
            { name: 'Engagement Photos', images: [] },
            { name: 'Our Journey', images: [] }
          ]
        }
      },
      accommodations: {
        content: {
          title: 'Travel & Accommodations',
          hotels: [],
          transportation: {
            airport: 'Nearest Airport',
            shuttleInfo: 'Shuttle service information',
            parkingInfo: 'Parking information'
          }
        }
      },
      faq: {
        content: {
          title: 'Frequently Asked Questions',
          questions: [
            {
              question: 'What is the dress code?',
              answer: website.eventDetails.dresscode || 'Formal attire requested'
            },
            {
              question: 'Can I bring a plus one?',
              answer: 'Please refer to your invitation for guest details'
            },
            {
              question: 'Are children welcome?',
              answer: 'We love your little ones, but this will be an adults-only celebration'
            },
            {
              question: 'Will there be parking?',
              answer: 'Yes, complimentary parking is available at the venue'
            }
          ]
        }
      }
    };

    // Update website with default content
    db.update('weddingWebsites', websiteId, {
      sections: defaultSections
    });

    return defaultSections;
  }

  /**
   * Update website content
   */
  updateWebsite(websiteId, updates) {
    const website = db.findById('weddingWebsites', websiteId);
    
    if (!website) {
      throw new Error('Website not found');
    }

    // Handle subdomain change
    if (updates.subdomain && updates.subdomain !== website.subdomain) {
      const existing = db.findAll('weddingWebsites', { subdomain: updates.subdomain });
      if (existing.length > 0 && existing[0].id !== websiteId) {
        throw new Error('Subdomain already taken');
      }
      updates.url = `https://weddings.rubanbleu.com/${updates.subdomain}`;
    }

    return db.update('weddingWebsites', websiteId, updates);
  }

  /**
   * Publish/unpublish website
   */
  togglePublish(websiteId) {
    const website = db.findById('weddingWebsites', websiteId);
    
    if (!website) {
      throw new Error('Website not found');
    }

    return db.update('weddingWebsites', websiteId, {
      isPublished: !website.isPublished,
      publishedAt: !website.isPublished ? new Date().toISOString() : website.publishedAt
    });
  }

  /**
   * Get website by subdomain (for public access)
   */
  getWebsiteBySubdomain(subdomain) {
    const websites = db.findAll('weddingWebsites', { subdomain, isPublished: true });
    
    if (!websites || websites.length === 0) {
      return null;
    }

    const website = websites[0];
    
    // Track view
    db.update('weddingWebsites', website.id, {
      analytics: {
        ...website.analytics,
        views: (website.analytics?.views || 0) + 1
      }
    });

    return website;
  }

  /**
   * Submit RSVP for a website
   */
  submitRsvp(websiteId, rsvpData) {
    const website = db.findById('weddingWebsites', websiteId);
    
    if (!website) {
      throw new Error('Website not found');
    }

    if (!website.rsvpEnabled) {
      throw new Error('RSVP is not enabled for this website');
    }

    if (new Date(website.rsvpDeadline) < new Date()) {
      throw new Error('RSVP deadline has passed');
    }

    // Create or update guest in the project
    const guest = db.create('guests', {
      projectId: website.projectId,
      firstName: rsvpData.fullName?.split(' ')[0] || '',
      lastName: rsvpData.fullName?.split(' ')[1] || '',
      email: rsvpData.email,
      phone: rsvpData.phone,
      rsvpStatus: rsvpData.attending ? 'YES' : 'NO',
      rsvpDate: new Date().toISOString(),
      guestCount: rsvpData.guestCount || 1,
      mealSelection: rsvpData.mealPreference,
      dietaryRestrictions: rsvpData.dietaryRestrictions,
      notes: rsvpData.message,
      source: 'Website RSVP'
    });

    // Update analytics
    db.update('weddingWebsites', websiteId, {
      analytics: {
        ...website.analytics,
        rsvpSubmissions: (website.analytics?.rsvpSubmissions || 0) + 1
      }
    });

    return guest;
  }

  /**
   * Helper: Generate subdomain from project name
   */
  generateSubdomain(projectName) {
    return projectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 30);
  }

  /**
   * Helper: Format event date
   */
  formatEventDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  /**
   * Helper: Calculate RSVP deadline (30 days before event)
   */
  calculateRsvpDeadline(eventDate) {
    if (!eventDate) return null;
    const deadline = new Date(eventDate);
    deadline.setDate(deadline.getDate() - 30);
    return deadline.toISOString();
  }

  /**
   * Helper: Generate password
   */
  generatePassword() {
    return crypto.randomBytes(4).toString('hex');
  }

  /**
   * Helper: Convert feature to page name
   */
  featureToPage(feature) {
    return feature.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Helper: Generate sections based on template
   */
  generateSections(template, config) {
    const sections = [];
    
    template.features.forEach(feature => {
      const sectionName = this.featureToPage(feature);
      sections.push({
        name: sectionName,
        enabled: true,
        order: sections.length
      });
    });

    return sections;
  }

  /**
   * Get website analytics
   */
  getAnalytics(websiteId) {
    const website = db.findById('weddingWebsites', websiteId);
    
    if (!website) {
      throw new Error('Website not found');
    }

    // Get RSVP stats
    const guests = db.findAll('guests', { projectId: website.projectId });
    const rsvpStats = {
      total: guests.length,
      attending: guests.filter(g => g.rsvpStatus === 'YES').length,
      notAttending: guests.filter(g => g.rsvpStatus === 'NO').length,
      pending: guests.filter(g => g.rsvpStatus === 'PENDING').length,
      totalGuests: guests.reduce((sum, g) => sum + (g.guestCount || 1), 0)
    };

    return {
      ...website.analytics,
      rsvpStats,
      publishedAt: website.publishedAt,
      lastUpdated: website.updatedAt
    };
  }
}

module.exports = new WebsiteGeneratorService();
