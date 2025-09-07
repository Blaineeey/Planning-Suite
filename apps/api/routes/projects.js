const express = require('express');
const router = express.Router();
const db = require('../models/database');

// ==================== PROJECT ROUTES ====================

// Get all projects
router.get('/projects', (req, res) => {
  try {
    const projects = db.findAll('projects', req.query);
    res.json({
      success: true,
      data: projects,
      total: projects.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/projects', (req, res) => {
  try {
    const project = db.create('projects', {
      ...req.body,
      status: req.body.status || 'PLANNING',
      teamMembers: req.body.teamMembers || [],
      files: []
    });
    
    // Create default checklist
    const checklist = db.create('checklists', {
      projectId: project.id,
      name: 'Main Checklist',
      items: []
    });
    
    // Create default timeline
    const timeline = db.create('timelines', {
      projectId: project.id,
      name: 'Event Timeline',
      items: []
    });
    
    // Create budget
    const budget = db.create('budgets', {
      projectId: project.id,
      total: project.budget || 0,
      allocated: 0,
      spent: 0,
      categories: []
    });
    
    // Generate wedding website if wedding project
    if (project.type === 'WEDDING') {
      const website = db.create('weddingWebsites', {
        projectId: project.id,
        subdomain: db.generateSlug(project.name),
        url: `https://weddings.rubanbleu.com/${db.generateSlug(project.name)}`,
        templateId: 'default',
        theme: {
          primaryColor: '#e91e63',
          secondaryColor: '#f8bbd0',
          fontFamily: 'Playfair Display'
        },
        pages: ['home', 'story', 'schedule', 'venue', 'rsvp', 'registry'],
        isPublished: false,
        privacy: 'LINK_ONLY',
        rsvpEnabled: true
      });
      
      project.websiteId = website.id;
    }
    
    db.update('projects', project.id, project);
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
router.get('/projects/:id', (req, res) => {
  try {
    const project = db.findById('projects', req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Get related data
    const checklist = db.findAll('checklists', { projectId: project.id })[0];
    const timeline = db.findAll('timelines', { projectId: project.id })[0];
    const budget = db.findAll('budgets', { projectId: project.id })[0];
    const tasks = db.findAll('tasks', { projectId: project.id });
    const guests = db.findAll('guests', { projectId: project.id });
    const website = project.websiteId ? db.findById('weddingWebsites', project.websiteId) : null;
    
    res.json({
      success: true,
      data: {
        ...project,
        checklist,
        timeline,
        budget,
        tasks,
        guests,
        website
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/projects/:id', (req, res) => {
  try {
    const project = db.update('projects', req.params.id, req.body);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CHECKLIST ROUTES ====================

// Get project checklist
router.get('/projects/:projectId/checklist', (req, res) => {
  try {
    const checklist = db.findAll('checklists', { projectId: req.params.projectId })[0];
    const items = db.findAll('checklistItems', { checklistId: checklist?.id });
    
    res.json({
      success: true,
      data: {
        ...checklist,
        items
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add checklist item
router.post('/projects/:projectId/checklist/items', (req, res) => {
  try {
    const checklist = db.findAll('checklists', { projectId: req.params.projectId })[0];
    
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    
    const item = db.create('checklistItems', {
      checklistId: checklist.id,
      projectId: req.params.projectId,
      ...req.body,
      completed: false
    });
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle checklist item
router.patch('/checklist-items/:id/toggle', (req, res) => {
  try {
    const item = db.findById('checklistItems', req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const updated = db.update('checklistItems', req.params.id, {
      completed: !item.completed,
      completedAt: !item.completed ? new Date().toISOString() : null
    });
    
    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== TIMELINE ROUTES ====================

// Get project timeline
router.get('/projects/:projectId/timeline', (req, res) => {
  try {
    const timeline = db.findAll('timelines', { projectId: req.params.projectId })[0];
    const items = db.findAll('timelineItems', { timelineId: timeline?.id });
    
    res.json({
      success: true,
      data: {
        ...timeline,
        items: items.sort((a, b) => new Date(a.time) - new Date(b.time))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add timeline item
router.post('/projects/:projectId/timeline/items', (req, res) => {
  try {
    const timeline = db.findAll('timelines', { projectId: req.params.projectId })[0];
    
    if (!timeline) {
      return res.status(404).json({ error: 'Timeline not found' });
    }
    
    const item = db.create('timelineItems', {
      timelineId: timeline.id,
      projectId: req.params.projectId,
      ...req.body
    });
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== TASK ROUTES ====================

// Get project tasks
router.get('/projects/:projectId/tasks', (req, res) => {
  try {
    const tasks = db.findAll('tasks', { projectId: req.params.projectId });
    res.json({
      success: true,
      data: tasks,
      total: tasks.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/projects/:projectId/tasks', (req, res) => {
  try {
    const task = db.create('tasks', {
      projectId: req.params.projectId,
      ...req.body,
      status: req.body.status || 'TODO'
    });
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/tasks/:id', (req, res) => {
  try {
    const task = db.update('tasks', req.params.id, req.body);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== BUDGET ROUTES ====================

// Get project budget
router.get('/projects/:projectId/budget', (req, res) => {
  try {
    const budget = db.findAll('budgets', { projectId: req.params.projectId })[0];
    const categories = db.findAll('budgetCategories', { budgetId: budget?.id });
    const lines = db.findAll('budgetLines', { budgetId: budget?.id });
    
    res.json({
      success: true,
      data: {
        ...budget,
        categories,
        lines
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add budget category
router.post('/projects/:projectId/budget/categories', (req, res) => {
  try {
    const budget = db.findAll('budgets', { projectId: req.params.projectId })[0];
    
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    const category = db.create('budgetCategories', {
      budgetId: budget.id,
      projectId: req.params.projectId,
      ...req.body,
      allocated: req.body.allocated || 0,
      spent: 0
    });
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add budget line item
router.post('/projects/:projectId/budget/lines', (req, res) => {
  try {
    const budget = db.findAll('budgets', { projectId: req.params.projectId })[0];
    
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    const line = db.create('budgetLines', {
      budgetId: budget.id,
      projectId: req.params.projectId,
      ...req.body
    });
    
    // Update category spending if categoryId provided
    if (line.categoryId) {
      const category = db.findById('budgetCategories', line.categoryId);
      if (category) {
        db.update('budgetCategories', line.categoryId, {
          spent: (category.spent || 0) + line.amount
        });
      }
    }
    
    // Update total budget spending
    db.update('budgets', budget.id, {
      spent: (budget.spent || 0) + line.amount
    });
    
    res.status(201).json({
      success: true,
      data: line
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== FILES ROUTES ====================

// Upload file to project
router.post('/projects/:projectId/files', (req, res) => {
  try {
    const file = db.create('files', {
      projectId: req.params.projectId,
      name: req.body.name,
      type: req.body.type,
      size: req.body.size,
      url: req.body.url || '/uploads/' + Date.now() + '-' + req.body.name,
      uploadedBy: req.body.uploadedBy
    });
    
    res.status(201).json({
      success: true,
      data: file
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project files
router.get('/projects/:projectId/files', (req, res) => {
  try {
    const files = db.findAll('files', { projectId: req.params.projectId });
    res.json({
      success: true,
      data: files,
      total: files.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
