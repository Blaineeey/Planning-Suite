const express = require('express');
const router = express.Router();
const db = require('../models/database');

// ==================== CRM ROUTES ====================

// Get all leads
router.get('/leads', (req, res) => {
  try {
    const leads = db.findAll('leads', req.query);
    res.json({
      success: true,
      data: leads,
      total: leads.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new lead
router.post('/leads', (req, res) => {
  try {
    const lead = db.create('leads', {
      ...req.body,
      status: req.body.status || 'NEW',
      score: 0,
      tags: req.body.tags || []
    });
    
    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lead by ID
router.get('/leads/:id', (req, res) => {
  try {
    const lead = db.findById('leads', req.params.id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lead
router.put('/leads/:id', (req, res) => {
  try {
    const lead = db.update('leads', req.params.id, req.body);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Convert lead to client
router.post('/leads/:id/convert', (req, res) => {
  try {
    const lead = db.findById('leads', req.params.id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    // Create client from lead
    const client = db.create('contacts', {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      leadId: lead.id,
      type: 'CLIENT'
    });
    
    // Update lead status
    db.update('leads', req.params.id, { 
      status: 'CLOSED_WON',
      clientId: client.id 
    });
    
    // Create project if requested
    let project = null;
    if (req.body.createProject) {
      project = db.create('projects', {
        clientId: client.id,
        name: `${lead.firstName} ${lead.lastName} - ${lead.eventType || 'Event'}`,
        eventDate: lead.eventDate,
        budget: lead.budget,
        guestCount: lead.guestCount,
        venue: lead.venue,
        status: 'PLANNING'
      });
    }
    
    res.json({
      success: true,
      data: {
        client,
        project,
        message: 'Lead successfully converted to client'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PIPELINE ROUTES ====================

// Get pipeline stages
router.get('/pipeline-stages', (req, res) => {
  const stages = [
    { id: '1', name: 'New Lead', order: 1, color: '#gray' },
    { id: '2', name: 'Discovery', order: 2, color: '#blue' },
    { id: '3', name: 'Proposal Sent', order: 3, color: '#purple' },
    { id: '4', name: 'Negotiation', order: 4, color: '#orange' },
    { id: '5', name: 'Contracted', order: 5, color: '#green' },
    { id: '6', name: 'Lost', order: 6, color: '#red' }
  ];
  
  res.json({
    success: true,
    data: stages
  });
});

// ==================== PROPOSALS ROUTES ====================

// Get all proposals
router.get('/proposals', (req, res) => {
  try {
    const proposals = db.findAll('proposals', req.query);
    res.json({
      success: true,
      data: proposals,
      total: proposals.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create proposal
router.post('/proposals', (req, res) => {
  try {
    const proposal = db.create('proposals', {
      ...req.body,
      number: 'PROP-' + Date.now(),
      status: 'DRAFT',
      lineItems: req.body.lineItems || [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0
    });
    
    // Calculate totals
    let subtotal = 0;
    proposal.lineItems.forEach(item => {
      subtotal += (item.quantity || 1) * (item.price || 0);
    });
    
    proposal.subtotal = subtotal;
    proposal.tax = subtotal * (req.body.taxRate || 0);
    proposal.total = subtotal + proposal.tax - (proposal.discount || 0);
    
    db.update('proposals', proposal.id, proposal);
    
    res.status(201).json({
      success: true,
      data: proposal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send proposal
router.post('/proposals/:id/send', (req, res) => {
  try {
    const proposal = db.update('proposals', req.params.id, {
      status: 'SENT',
      sentAt: new Date().toISOString()
    });
    
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    // Here you would send the actual email
    // For now, we'll just update the status
    
    res.json({
      success: true,
      data: proposal,
      message: 'Proposal sent successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept proposal
router.post('/proposals/:id/accept', (req, res) => {
  try {
    const proposal = db.findById('proposals', req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    // Update proposal status
    db.update('proposals', req.params.id, {
      status: 'ACCEPTED',
      acceptedAt: new Date().toISOString(),
      signature: req.body.signature
    });
    
    // Create contract from proposal
    const contract = db.create('contracts', {
      proposalId: proposal.id,
      projectId: proposal.projectId,
      number: 'CONTRACT-' + Date.now(),
      title: proposal.title,
      status: 'DRAFT',
      content: req.body.contractContent || 'Standard contract terms...',
      terms: proposal.terms
    });
    
    res.json({
      success: true,
      data: {
        proposal,
        contract,
        message: 'Proposal accepted and contract created'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CONTRACTS ROUTES ====================

// Get all contracts
router.get('/contracts', (req, res) => {
  try {
    const contracts = db.findAll('contracts', req.query);
    res.json({
      success: true,
      data: contracts,
      total: contracts.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create contract
router.post('/contracts', (req, res) => {
  try {
    const contract = db.create('contracts', {
      ...req.body,
      number: 'CONTRACT-' + Date.now(),
      status: 'DRAFT',
      signatures: []
    });
    
    res.status(201).json({
      success: true,
      data: contract
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign contract
router.post('/contracts/:id/sign', (req, res) => {
  try {
    const contract = db.findById('contracts', req.params.id);
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Add signature
    const signature = {
      name: req.body.name,
      email: req.body.email,
      signedAt: new Date().toISOString(),
      ipAddress: req.ip,
      signature: req.body.signature
    };
    
    contract.signatures = contract.signatures || [];
    contract.signatures.push(signature);
    
    // Update contract status if all required signatures are collected
    const updatedContract = db.update('contracts', req.params.id, {
      signatures: contract.signatures,
      status: 'SIGNED',
      signedAt: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: updatedContract,
      message: 'Contract signed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== INVOICES ROUTES ====================

// Get all invoices
router.get('/invoices', (req, res) => {
  try {
    const invoices = db.findAll('invoices', req.query);
    res.json({
      success: true,
      data: invoices,
      total: invoices.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create invoice
router.post('/invoices', (req, res) => {
  try {
    const invoice = db.create('invoices', {
      ...req.body,
      number: 'INV-' + Date.now(),
      status: 'DRAFT',
      amountPaid: 0,
      balance: req.body.total || 0
    });
    
    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process payment
router.post('/invoices/:id/pay', (req, res) => {
  try {
    const invoice = db.findById('invoices', req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    const payment = db.create('payments', {
      invoiceId: invoice.id,
      projectId: invoice.projectId,
      amount: req.body.amount,
      method: req.body.method, // CARD, BANK, PAYPAL
      status: 'COMPLETED',
      transactionId: 'TXN-' + Date.now(),
      processedAt: new Date().toISOString()
    });
    
    // Update invoice
    const amountPaid = (invoice.amountPaid || 0) + payment.amount;
    const balance = invoice.total - amountPaid;
    
    db.update('invoices', invoice.id, {
      amountPaid,
      balance,
      status: balance <= 0 ? 'PAID' : 'PARTIAL'
    });
    
    res.json({
      success: true,
      data: {
        payment,
        invoice: db.findById('invoices', invoice.id),
        message: 'Payment processed successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== APPOINTMENTS/SCHEDULING ====================

// Get appointments
router.get('/appointments', (req, res) => {
  try {
    const appointments = db.findAll('appointments', req.query);
    res.json({
      success: true,
      data: appointments,
      total: appointments.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create appointment
router.post('/appointments', (req, res) => {
  try {
    const appointment = db.create('appointments', {
      ...req.body,
      status: 'SCHEDULED'
    });
    
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get availability
router.get('/appointments/availability', (req, res) => {
  // Simple availability logic - in production, this would check calendar
  const slots = [];
  const startDate = new Date(req.query.date || new Date());
  
  for (let i = 9; i < 17; i++) {
    slots.push({
      time: `${i}:00`,
      available: Math.random() > 0.3 // Random availability for demo
    });
  }
  
  res.json({
    success: true,
    data: {
      date: startDate.toISOString().split('T')[0],
      slots
    }
  });
});

module.exports = router;
