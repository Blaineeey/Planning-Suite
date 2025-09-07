const express = require('express');
const router = express.Router();
const db = require('../models/database');

// ==================== GUEST MANAGEMENT ROUTES ====================

// Get project guests
router.get('/projects/:projectId/guests', (req, res) => {
  try {
    const guests = db.findAll('guests', { projectId: req.params.projectId });
    const households = db.findAll('households', { projectId: req.params.projectId });
    
    res.json({
      success: true,
      data: {
        guests,
        households,
        stats: {
          total: guests.length,
          confirmed: guests.filter(g => g.rsvpStatus === 'YES').length,
          declined: guests.filter(g => g.rsvpStatus === 'NO').length,
          pending: guests.filter(g => g.rsvpStatus === 'PENDING').length,
          adults: guests.filter(g => g.ageGroup === 'ADULT').length,
          children: guests.filter(g => g.ageGroup === 'CHILD').length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add guest
router.post('/projects/:projectId/guests', (req, res) => {
  try {
    // Create household if needed
    let householdId = req.body.householdId;
    if (!householdId && req.body.createHousehold) {
      const household = db.create('households', {
        projectId: req.params.projectId,
        name: req.body.householdName || `${req.body.firstName} ${req.body.lastName} Household`,
        address: req.body.address
      });
      householdId = household.id;
    }
    
    // Generate unique RSVP code
    const rsvpCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const guest = db.create('guests', {
      projectId: req.params.projectId,
      householdId,
      ...req.body,
      rsvpStatus: 'PENDING',
      rsvpCode,
      ageGroup: req.body.ageGroup || 'ADULT'
    });
    
    res.status(201).json({
      success: true,
      data: guest
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update guest
router.put('/guests/:id', (req, res) => {
  try {
    const guest = db.update('guests', req.params.id, req.body);
    
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    
    res.json({
      success: true,
      data: guest
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete guest
router.delete('/guests/:id', (req, res) => {
  try {
    const deleted = db.delete('guests', req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    
    res.json({
      success: true,
      message: 'Guest deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import guests CSV
router.post('/projects/:projectId/guests/import', (req, res) => {
  try {
    const guests = req.body.guests || [];
    const imported = [];
    const errors = [];
    
    guests.forEach((guestData, index) => {
      try {
        // Generate unique RSVP code
        const rsvpCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const guest = db.create('guests', {
          projectId: req.params.projectId,
          firstName: guestData.firstName,
          lastName: guestData.lastName,
          email: guestData.email,
          phone: guestData.phone,
          rsvpStatus: 'PENDING',
          rsvpCode,
          ageGroup: guestData.ageGroup || 'ADULT',
          side: guestData.side || 'BOTH',
          plusOne: guestData.plusOne === 'true' || guestData.plusOne === true,
          tags: guestData.tags ? guestData.tags.split(',').map(t => t.trim()) : []
        });
        
        imported.push(guest);
      } catch (error) {
        errors.push({
          row: index + 1,
          error: error.message
        });
      }
    });
    
    res.json({
      success: true,
      data: {
        imported: imported.length,
        errors: errors.length,
        guests: imported,
        errorDetails: errors
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== RSVP ROUTES ====================

// Submit RSVP (public endpoint)
router.post('/rsvp/submit', (req, res) => {
  try {
    const { code, status, mealSelection, dietaryRestrictions, plusOneName, message } = req.body;
    
    // Find guest by RSVP code
    const guest = db.findAll('guests', {}).find(g => g.rsvpCode === code.toUpperCase());
    
    if (!guest) {
      return res.status(404).json({ error: 'Invalid RSVP code' });
    }
    
    // Update guest RSVP
    const updated = db.update('guests', guest.id, {
      rsvpStatus: status,
      rsvpDate: new Date().toISOString(),
      mealSelection,
      dietaryRestrictions,
      plusOneName: guest.plusOne ? plusOneName : null,
      notes: message
    });
    
    // Create RSVP record
    const rsvp = db.create('rsvps', {
      guestId: guest.id,
      projectId: guest.projectId,
      status,
      submittedAt: new Date().toISOString(),
      ipAddress: req.ip
    });
    
    res.json({
      success: true,
      data: {
        message: 'Thank you for your RSVP!',
        guest: {
          firstName: updated.firstName,
          lastName: updated.lastName,
          status: updated.rsvpStatus
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get RSVP by code (for guest lookup)
router.get('/rsvp/lookup/:code', (req, res) => {
  try {
    const guest = db.findAll('guests', {}).find(g => g.rsvpCode === req.params.code.toUpperCase());
    
    if (!guest) {
      return res.status(404).json({ error: 'Invalid RSVP code' });
    }
    
    // Get project details for event info
    const project = db.findById('projects', guest.projectId);
    
    res.json({
      success: true,
      data: {
        guest: {
          firstName: guest.firstName,
          lastName: guest.lastName,
          plusOne: guest.plusOne,
          rsvpStatus: guest.rsvpStatus,
          mealSelection: guest.mealSelection
        },
        event: {
          name: project?.name,
          date: project?.eventDate,
          venue: project?.venue
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SEATING ROUTES ====================

// Get seating chart
router.get('/projects/:projectId/seating', (req, res) => {
  try {
    const tables = db.findAll('tables', { projectId: req.params.projectId });
    const seats = db.findAll('seats', { projectId: req.params.projectId });
    const guests = db.findAll('guests', { 
      projectId: req.params.projectId,
      rsvpStatus: 'YES'
    });
    
    res.json({
      success: true,
      data: {
        tables,
        seats,
        guests,
        stats: {
          totalTables: tables.length,
          totalCapacity: tables.reduce((sum, t) => sum + (t.capacity || 0), 0),
          seatedGuests: guests.filter(g => g.tableId).length,
          unseatedGuests: guests.filter(g => !g.tableId).length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create table
router.post('/projects/:projectId/tables', (req, res) => {
  try {
    const table = db.create('tables', {
      projectId: req.params.projectId,
      ...req.body,
      capacity: req.body.capacity || 10,
      currentSeats: 0
    });
    
    res.status(201).json({
      success: true,
      data: table
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign guest to table
router.post('/guests/:guestId/seat', (req, res) => {
  try {
    const guest = db.findById('guests', req.params.guestId);
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    
    const table = db.findById('tables', req.body.tableId);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    // Check table capacity
    const seatedAtTable = db.findAll('guests', { tableId: table.id }).length;
    if (seatedAtTable >= table.capacity) {
      return res.status(400).json({ error: 'Table is at full capacity' });
    }
    
    // Update guest
    const updated = db.update('guests', req.params.guestId, {
      tableId: req.body.tableId,
      seatNumber: req.body.seatNumber
    });
    
    // Create seat record
    const seat = db.create('seats', {
      projectId: guest.projectId,
      tableId: req.body.tableId,
      guestId: guest.id,
      seatNumber: req.body.seatNumber
    });
    
    res.json({
      success: true,
      data: {
        guest: updated,
        seat
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export seating chart
router.get('/projects/:projectId/seating/export', (req, res) => {
  try {
    const tables = db.findAll('tables', { projectId: req.params.projectId });
    const guests = db.findAll('guests', { projectId: req.params.projectId });
    
    const seatingChart = tables.map(table => {
      const tableGuests = guests.filter(g => g.tableId === table.id);
      return {
        tableName: table.name,
        tableNumber: table.number,
        capacity: table.capacity,
        guests: tableGuests.map(g => ({
          name: `${g.firstName} ${g.lastName}`,
          meal: g.mealSelection,
          dietary: g.dietaryRestrictions,
          seat: g.seatNumber
        }))
      };
    });
    
    res.json({
      success: true,
      data: seatingChart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MEAL SELECTION ROUTES ====================

// Get meal options
router.get('/projects/:projectId/meals', (req, res) => {
  try {
    const mealSelections = db.findAll('mealSelections', { projectId: req.params.projectId });
    
    if (!mealSelections.length) {
      // Return default options
      const defaultOptions = [
        { id: '1', name: 'Beef', description: 'Grilled beef with seasonal vegetables' },
        { id: '2', name: 'Chicken', description: 'Herb-roasted chicken breast' },
        { id: '3', name: 'Fish', description: 'Pan-seared salmon' },
        { id: '4', name: 'Vegetarian', description: 'Seasonal vegetable plate' },
        { id: '5', name: 'Kids Meal', description: 'Chicken tenders with fries' }
      ];
      
      return res.json({
        success: true,
        data: defaultOptions
      });
    }
    
    res.json({
      success: true,
      data: mealSelections
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set meal options
router.post('/projects/:projectId/meals', (req, res) => {
  try {
    const mealSelection = db.create('mealSelections', {
      projectId: req.params.projectId,
      ...req.body
    });
    
    res.status(201).json({
      success: true,
      data: mealSelection
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get meal statistics
router.get('/projects/:projectId/meals/stats', (req, res) => {
  try {
    const guests = db.findAll('guests', { 
      projectId: req.params.projectId,
      rsvpStatus: 'YES'
    });
    
    const mealCounts = {};
    const dietaryRestrictions = [];
    
    guests.forEach(guest => {
      if (guest.mealSelection) {
        mealCounts[guest.mealSelection] = (mealCounts[guest.mealSelection] || 0) + 1;
      }
      if (guest.dietaryRestrictions) {
        dietaryRestrictions.push({
          guest: `${guest.firstName} ${guest.lastName}`,
          restrictions: guest.dietaryRestrictions
        });
      }
    });
    
    res.json({
      success: true,
      data: {
        mealCounts,
        dietaryRestrictions,
        totalGuests: guests.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
