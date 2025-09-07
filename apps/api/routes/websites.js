const express = require('express');
const router = express.Router();
const db = require('../models/database');

// ==================== WEDDING WEBSITE ROUTES ====================

// Get website by project
router.get('/projects/:projectId/website', (req, res) => {
  try {
    const website = db.findAll('weddingWebsites', { projectId: req.params.projectId })[0];
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    res.json({
      success: true,
      data: website
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create website
router.post('/projects/:projectId/website', (req, res) => {
  try {
    // Check if website already exists
    const existing = db.findAll('weddingWebsites', { projectId: req.params.projectId })[0];
    if (existing) {
      return res.status(400).json({ error: 'Website already exists for this project' });
    }
    
    const project = db.findById('projects', req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const subdomain = req.body.subdomain || db.generateSlug(project.name);
    
    const website = db.create('weddingWebsites', {
      projectId: req.params.projectId,
      subdomain,
      url: `https://weddings.rubanbleu.com/${subdomain}`,
      templateId: req.body.templateId || 'elegant',
      theme: req.body.theme || {
        primaryColor: '#e91e63',
        secondaryColor: '#f8bbd0',
        fontFamily: 'Playfair Display',
        backgroundStyle: 'floral'
      },
      coupleNames: req.body.coupleNames || {
        person1: 'Partner 1',
        person2: 'Partner 2'
      },
      pages: ['home', 'our-story', 'schedule', 'venue', 'accommodations', 'rsvp', 'registry'],
      navigation: [
        { label: 'Home', path: '/' },
        { label: 'Our Story', path: '/our-story' },
        { label: 'Schedule', path: '/schedule' },
        { label: 'Venue', path: '/venue' },
        { label: 'Accommodations', path: '/accommodations' },
        { label: 'RSVP', path: '/rsvp' },
        { label: 'Registry', path: '/registry' }
      ],
      eventDetails: {
        date: project.eventDate,
        time: req.body.eventTime || '4:00 PM',
        venue: project.venue
      },
      rsvpEnabled: true,
      rsvpDeadline: req.body.rsvpDeadline,
      privacy: req.body.privacy || 'LINK_ONLY',
      isPublished: false
    });
    
    // Update project with website ID
    db.update('projects', req.params.projectId, { websiteId: website.id });
    
    res.status(201).json({
      success: true,
      data: website
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update website
router.put('/websites/:id', (req, res) => {
  try {
    const website = db.update('weddingWebsites', req.params.id, req.body);
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    res.json({
      success: true,
      data: website
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publish website
router.post('/websites/:id/publish', (req, res) => {
  try {
    const website = db.update('weddingWebsites', req.params.id, {
      isPublished: true,
      publishedAt: new Date().toISOString()
    });
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    res.json({
      success: true,
      data: website,
      message: 'Website published successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unpublish website
router.post('/websites/:id/unpublish', (req, res) => {
  try {
    const website = db.update('weddingWebsites', req.params.id, {
      isPublished: false
    });
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    res.json({
      success: true,
      data: website,
      message: 'Website unpublished'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== WEBSITE CONTENT ROUTES ====================

// Update website story
router.put('/websites/:id/story', (req, res) => {
  try {
    const website = db.update('weddingWebsites', req.params.id, {
      story: req.body.story,
      storyPhotos: req.body.photos
    });
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    res.json({
      success: true,
      data: website
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update website schedule
router.put('/websites/:id/schedule', (req, res) => {
  try {
    const website = db.update('weddingWebsites', req.params.id, {
      schedule: req.body.schedule
    });
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    res.json({
      success: true,
      data: website
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update venue information
router.put('/websites/:id/venue', (req, res) => {
  try {
    const website = db.update('weddingWebsites', req.params.id, {
      venue: req.body.venue
    });
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    res.json({
      success: true,
      data: website
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update accommodations
router.put('/websites/:id/accommodations', (req, res) => {
  try {
    const website = db.update('weddingWebsites', req.params.id, {
      accommodations: req.body.accommodations
    });
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    res.json({
      success: true,
      data: website
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update registry
router.put('/websites/:id/registry', (req, res) => {
  try {
    const website = db.update('weddingWebsites', req.params.id, {
      registry: req.body.registry
    });
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    res.json({
      success: true,
      data: website
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== WEBSITE TEMPLATES ====================

// Get available templates
router.get('/website-templates', (req, res) => {
  const templates = [
    {
      id: 'elegant',
      name: 'Elegant',
      preview: '/templates/elegant.jpg',
      theme: {
        primaryColor: '#e91e63',
        secondaryColor: '#f8bbd0',
        fontFamily: 'Playfair Display',
        style: 'classic'
      }
    },
    {
      id: 'modern',
      name: 'Modern',
      preview: '/templates/modern.jpg',
      theme: {
        primaryColor: '#2196f3',
        secondaryColor: '#bbdefb',
        fontFamily: 'Montserrat',
        style: 'minimal'
      }
    },
    {
      id: 'rustic',
      name: 'Rustic',
      preview: '/templates/rustic.jpg',
      theme: {
        primaryColor: '#795548',
        secondaryColor: '#d7ccc8',
        fontFamily: 'Libre Baskerville',
        style: 'vintage'
      }
    },
    {
      id: 'garden',
      name: 'Garden',
      preview: '/templates/garden.jpg',
      theme: {
        primaryColor: '#4caf50',
        secondaryColor: '#c8e6c9',
        fontFamily: 'Dancing Script',
        style: 'floral'
      }
    },
    {
      id: 'beach',
      name: 'Beach',
      preview: '/templates/beach.jpg',
      theme: {
        primaryColor: '#00bcd4',
        secondaryColor: '#b2ebf2',
        fontFamily: 'Raleway',
        style: 'tropical'
      }
    }
  ];
  
  res.json({
    success: true,
    data: templates
  });
});

// ==================== PUBLIC WEBSITE ACCESS ====================

// Get public website by subdomain
router.get('/public/websites/:subdomain', (req, res) => {
  try {
    const website = db.findAll('weddingWebsites', { 
      subdomain: req.params.subdomain,
      isPublished: true
    })[0];
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }
    
    // Check privacy settings
    if (website.privacy === 'PASSWORD') {
      // Verify password if provided
      if (req.headers.authorization !== website.password) {
        return res.status(401).json({ error: 'Password required' });
      }
    }
    
    // Get project details
    const project = db.findById('projects', website.projectId);
    
    // Track analytics
    db.create('websiteAnalytics', {
      websiteId: website.id,
      event: 'pageview',
      page: req.query.page || 'home',
      referrer: req.headers.referer,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.json({
      success: true,
      data: {
        ...website,
        project: {
          name: project?.name,
          eventDate: project?.eventDate,
          venue: project?.venue
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit RSVP from website
router.post('/public/websites/:subdomain/rsvp', (req, res) => {
  try {
    const website = db.findAll('weddingWebsites', { 
      subdomain: req.params.subdomain,
      isPublished: true,
      rsvpEnabled: true
    })[0];
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found or RSVP disabled' });
    }
    
    // Check RSVP deadline
    if (website.rsvpDeadline && new Date(website.rsvpDeadline) < new Date()) {
      return res.status(400).json({ error: 'RSVP deadline has passed' });
    }
    
    // Find or create guest
    let guest = db.findAll('guests', {
      projectId: website.projectId,
      email: req.body.email
    })[0];
    
    if (!guest) {
      guest = db.create('guests', {
        projectId: website.projectId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        rsvpStatus: req.body.attending ? 'YES' : 'NO',
        rsvpDate: new Date().toISOString(),
        mealSelection: req.body.mealSelection,
        dietaryRestrictions: req.body.dietaryRestrictions,
        plusOne: req.body.plusOne,
        plusOneName: req.body.plusOneName,
        notes: req.body.notes,
        rsvpCode: Math.random().toString(36).substring(2, 8).toUpperCase()
      });
    } else {
      guest = db.update('guests', guest.id, {
        rsvpStatus: req.body.attending ? 'YES' : 'NO',
        rsvpDate: new Date().toISOString(),
        mealSelection: req.body.mealSelection,
        dietaryRestrictions: req.body.dietaryRestrictions,
        plusOneName: req.body.plusOneName,
        notes: req.body.notes
      });
    }
    
    // Track RSVP in analytics
    db.create('websiteAnalytics', {
      websiteId: website.id,
      event: 'rsvp_submit',
      data: { guestId: guest.id, status: guest.rsvpStatus }
    });
    
    res.json({
      success: true,
      data: {
        message: req.body.attending 
          ? "Thank you! We can't wait to celebrate with you!"
          : "Thank you for letting us know. We'll miss you!",
        rsvpCode: guest.rsvpCode
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== WEBSITE ANALYTICS ====================

// Get website analytics
router.get('/websites/:id/analytics', (req, res) => {
  try {
    const analytics = db.findAll('websiteAnalytics', { websiteId: req.params.id });
    
    // Calculate statistics
    const pageviews = analytics.filter(a => a.event === 'pageview').length;
    const uniqueVisitors = [...new Set(analytics.map(a => a.ipAddress))].length;
    const rsvpSubmissions = analytics.filter(a => a.event === 'rsvp_submit').length;
    
    const pageBreakdown = {};
    analytics
      .filter(a => a.event === 'pageview')
      .forEach(a => {
        const page = a.page || 'home';
        pageBreakdown[page] = (pageBreakdown[page] || 0) + 1;
      });
    
    res.json({
      success: true,
      data: {
        pageviews,
        uniqueVisitors,
        rsvpSubmissions,
        pageBreakdown,
        recentActivity: analytics.slice(-20).reverse()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
