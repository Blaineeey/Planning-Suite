const express = require('express');
const router = express.Router();
const db = require('../models/database');

// ==================== VENDOR MANAGEMENT ROUTES ====================

// Get all vendors (public directory)
router.get('/vendors', (req, res) => {
  try {
    let vendors = db.findAll('vendors', { status: 'ACTIVE' });
    
    // Apply filters
    if (req.query.category) {
      vendors = vendors.filter(v => v.category === req.query.category);
    }
    if (req.query.priceRange) {
      vendors = vendors.filter(v => v.priceRange === req.query.priceRange);
    }
    if (req.query.location) {
      vendors = vendors.filter(v => 
        v.serviceArea && v.serviceArea.includes(req.query.location)
      );
    }
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      vendors = vendors.filter(v => 
        v.name.toLowerCase().includes(search) ||
        v.description?.toLowerCase().includes(search)
      );
    }
    
    // Sort by rating or featured
    vendors.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });
    
    res.json({
      success: true,
      data: vendors,
      total: vendors.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor categories
router.get('/vendor-categories', (req, res) => {
  const categories = [
    { id: '1', name: 'Photography', icon: '📷' },
    { id: '2', name: 'Videography', icon: '🎥' },
    { id: '3', name: 'Catering', icon: '🍽️' },
    { id: '4', name: 'Florist', icon: '💐' },
    { id: '5', name: 'Music/DJ', icon: '🎵' },
    { id: '6', name: 'Venue', icon: '🏛️' },
    { id: '7', name: 'Bakery', icon: '🎂' },
    { id: '8', name: 'Decor', icon: '🎨' },
    { id: '9', name: 'Hair & Makeup', icon: '💄' },
    { id: '10', name: 'Transportation', icon: '🚗' },
    { id: '11', name: 'Officiant', icon: '👔' },
    { id: '12', name: 'Rentals', icon: '🪑' },
    { id: '13', name: 'Invitations', icon: '✉️' },
    { id: '14', name: 'Entertainment', icon: '🎪' }
  ];
  
  res.json({
    success: true,
    data: categories
  });
});

// Create vendor (admin)
router.post('/vendors', (req, res) => {
  try {
    const vendor = db.create('vendors', {
      ...req.body,
      status: 'PENDING',
      rating: 0,
      reviews: [],
      featured: false,
      verified: false,
      portalAccess: false
    });
    
    res.status(201).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor by ID
router.get('/vendors/:id', (req, res) => {
  try {
    const vendor = db.findById('vendors', req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    // Get vendor documents and reviews
    const documents = db.findAll('vendorDocuments', { vendorId: vendor.id });
    const reviews = db.findAll('vendorReviews', { vendorId: vendor.id });
    
    res.json({
      success: true,
      data: {
        ...vendor,
        documents,
        reviews
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update vendor
router.put('/vendors/:id', (req, res) => {
  try {
    const vendor = db.update('vendors', req.params.id, req.body);
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Claim vendor profile
router.post('/vendors/:id/claim', (req, res) => {
  try {
    const vendor = db.findById('vendors', req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    // Verify ownership (in production, send email verification)
    const updated = db.update('vendors', req.params.id, {
      portalAccess: true,
      claimedBy: req.body.email,
      claimedAt: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: updated,
      message: 'Vendor profile claimed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== VENDOR PORTAL ROUTES ====================

// Vendor login
router.post('/vendor-portal/login', (req, res) => {
  try {
    const vendor = db.findAll('vendors', { email: req.body.email })[0];
    
    if (!vendor || !vendor.portalAccess) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In production, verify password
    res.json({
      success: true,
      data: {
        vendor,
        token: 'vendor-' + Date.now() // Simple token for demo
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update vendor profile (vendor portal)
router.put('/vendor-portal/profile', (req, res) => {
  try {
    // In production, verify vendor token
    const vendorId = req.body.vendorId;
    
    const vendor = db.update('vendors', vendorId, {
      name: req.body.name,
      description: req.body.description,
      phone: req.body.phone,
      website: req.body.website,
      address: req.body.address,
      serviceArea: req.body.serviceArea,
      priceRange: req.body.priceRange,
      images: req.body.images
    });
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload vendor document
router.post('/vendors/:id/documents', (req, res) => {
  try {
    const document = db.create('vendorDocuments', {
      vendorId: req.params.id,
      name: req.body.name,
      type: req.body.type, // INSURANCE, LICENSE, CERTIFICATE
      url: req.body.url,
      expiryDate: req.body.expiryDate,
      verified: false
    });
    
    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PROJECT VENDOR ROUTES ====================

// Get project vendors
router.get('/projects/:projectId/vendors', (req, res) => {
  try {
    const vendorRequests = db.findAll('vendorRequests', { projectId: req.params.projectId });
    const vendorIds = vendorRequests.map(r => r.vendorId);
    const vendors = vendorIds.map(id => db.findById('vendors', id)).filter(Boolean);
    
    res.json({
      success: true,
      data: vendorRequests.map(request => ({
        ...request,
        vendor: vendors.find(v => v.id === request.vendorId)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add vendor to project
router.post('/projects/:projectId/vendors', (req, res) => {
  try {
    const vendorRequest = db.create('vendorRequests', {
      projectId: req.params.projectId,
      vendorId: req.body.vendorId,
      service: req.body.service,
      status: 'PENDING',
      quotedPrice: req.body.quotedPrice,
      notes: req.body.notes
    });
    
    const vendor = db.findById('vendors', req.body.vendorId);
    
    res.status(201).json({
      success: true,
      data: {
        ...vendorRequest,
        vendor
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send vendor request
router.post('/vendor-requests/:id/send', (req, res) => {
  try {
    const request = db.update('vendorRequests', req.params.id, {
      status: 'SENT',
      sentAt: new Date().toISOString(),
      message: req.body.message
    });
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // In production, send email to vendor
    
    res.json({
      success: true,
      data: request,
      message: 'Request sent to vendor'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm vendor booking
router.post('/vendor-requests/:id/confirm', (req, res) => {
  try {
    const request = db.update('vendorRequests', req.params.id, {
      status: 'CONFIRMED',
      confirmedAt: new Date().toISOString(),
      finalPrice: req.body.finalPrice || req.body.quotedPrice,
      contractUrl: req.body.contractUrl
    });
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({
      success: true,
      data: request,
      message: 'Vendor booking confirmed'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== VENDOR REVIEWS ====================

// Add vendor review
router.post('/vendors/:id/reviews', (req, res) => {
  try {
    const review = db.create('vendorReviews', {
      vendorId: req.params.id,
      projectId: req.body.projectId,
      clientId: req.body.clientId,
      rating: req.body.rating,
      comment: req.body.comment,
      verified: false
    });
    
    // Update vendor average rating
    const allReviews = db.findAll('vendorReviews', { vendorId: req.params.id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    db.update('vendors', req.params.id, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    });
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor reviews
router.get('/vendors/:id/reviews', (req, res) => {
  try {
    const reviews = db.findAll('vendorReviews', { vendorId: req.params.id });
    
    res.json({
      success: true,
      data: reviews,
      total: reviews.length,
      averageRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== VENDOR SEARCH & COMPARISON ====================

// Compare vendors
router.post('/vendors/compare', (req, res) => {
  try {
    const vendorIds = req.body.vendorIds || [];
    const vendors = vendorIds.map(id => db.findById('vendors', id)).filter(Boolean);
    
    const comparison = vendors.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      category: vendor.category,
      rating: vendor.rating,
      reviewCount: vendor.reviewCount || 0,
      priceRange: vendor.priceRange,
      serviceArea: vendor.serviceArea,
      verified: vendor.verified,
      featured: vendor.featured,
      availability: vendor.availability
    }));
    
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check vendor availability
router.post('/vendors/:id/check-availability', (req, res) => {
  try {
    const vendor = db.findById('vendors', req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    // Simple availability check - in production, check calendar
    const isAvailable = Math.random() > 0.3; // Random for demo
    
    res.json({
      success: true,
      data: {
        vendorId: vendor.id,
        date: req.body.date,
        available: isAvailable,
        message: isAvailable 
          ? 'Vendor is available for this date' 
          : 'Vendor is not available for this date'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
