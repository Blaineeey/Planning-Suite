const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database (no external database needed)
const database = {
  users: [],
  projects: [],
  leads: [],
  tasks: [],
  invoices: []
};

// Helper function to generate ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// ==================== ROOT ROUTES ====================

app.get('/', (req, res) => {
  res.json({ 
    message: 'Ruban Bleu API Server',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      projects: {
        list: 'GET /api/projects',
        create: 'POST /api/projects',
        get: 'GET /api/projects/:id',
        update: 'PUT /api/projects/:id',
        delete: 'DELETE /api/projects/:id'
      },
      leads: {
        list: 'GET /api/leads',
        create: 'POST /api/leads'
      },
      tasks: {
        list: 'GET /api/tasks',
        create: 'POST /api/tasks'
      }
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'in-memory',
    stats: {
      users: database.users.length,
      projects: database.projects.length,
      leads: database.leads.length,
      tasks: database.tasks.length
    }
  });
});

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, organizationName } = req.body;
    
    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['email', 'password', 'firstName', 'lastName']
      });
    }
    
    // Check if user exists
    const existingUser = database.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: generateId(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      organizationName: organizationName || null,
      role: 'OWNER',
      createdAt: new Date().toISOString()
    };
    
    database.users.push(user);
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'development-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Find user
    const user = database.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'development-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-secret-key');
    const user = database.users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ==================== PROJECT ROUTES ====================

// Get all projects
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    data: database.projects,
    total: database.projects.length
  });
});

// Create project
app.post('/api/projects', (req, res) => {
  const project = {
    id: generateId(),
    ...req.body,
    status: req.body.status || 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  database.projects.push(project);
  
  res.status(201).json({
    success: true,
    data: project
  });
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  const project = database.projects.find(p => p.id === req.params.id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  res.json({
    success: true,
    data: project
  });
});

// Update project
app.put('/api/projects/:id', (req, res) => {
  const index = database.projects.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  database.projects[index] = {
    ...database.projects[index],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: database.projects[index]
  });
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  const index = database.projects.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  database.projects.splice(index, 1);
  
  res.json({
    success: true,
    message: 'Project deleted'
  });
});

// ==================== LEAD ROUTES ====================

// Get all leads
app.get('/api/leads', (req, res) => {
  res.json({
    success: true,
    data: database.leads,
    total: database.leads.length
  });
});

// Create lead
app.post('/api/leads', (req, res) => {
  const lead = {
    id: generateId(),
    ...req.body,
    status: req.body.status || 'NEW',
    createdAt: new Date().toISOString()
  };
  
  database.leads.push(lead);
  
  res.status(201).json({
    success: true,
    data: lead
  });
});

// ==================== TASK ROUTES ====================

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    data: database.tasks,
    total: database.tasks.length
  });
});

// Create task
app.post('/api/tasks', (req, res) => {
  const task = {
    id: generateId(),
    ...req.body,
    status: req.body.status || 'TODO',
    createdAt: new Date().toISOString()
  };
  
  database.tasks.push(task);
  
  res.status(201).json({
    success: true,
    data: task
  });
});

// ==================== INVOICE ROUTES ====================

// Get all invoices
app.get('/api/invoices', (req, res) => {
  res.json({
    success: true,
    data: database.invoices,
    total: database.invoices.length
  });
});

// Create invoice
app.post('/api/invoices', (req, res) => {
  const invoice = {
    id: generateId(),
    number: 'INV-' + Date.now(),
    ...req.body,
    status: req.body.status || 'DRAFT',
    createdAt: new Date().toISOString()
  };
  
  database.invoices.push(invoice);
  
  res.status(201).json({
    success: true,
    data: invoice
  });
});

// ==================== STATISTICS ENDPOINT ====================

app.get('/api/stats', (req, res) => {
  res.json({
    users: database.users.length,
    projects: database.projects.length,
    leads: database.leads.length,
    tasks: database.tasks.length,
    invoices: database.invoices.length,
    activeProjects: database.projects.filter(p => p.status === 'ACTIVE').length,
    completedTasks: database.tasks.filter(t => t.status === 'COMPLETED').length
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/projects',
      'POST /api/projects',
      'GET /api/leads',
      'POST /api/leads',
      'GET /api/tasks',
      'POST /api/tasks',
      'GET /api/stats'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ==================== START SERVER ====================

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('============================================');
  console.log('   RUBAN BLEU API SERVER IS RUNNING!');
  console.log('============================================');
  console.log('');
  console.log(`   Local:    http://localhost:${PORT}`);
  console.log(`   Network:  http://0.0.0.0:${PORT}`);
  console.log('');
  console.log('   Endpoints:');
  console.log(`   Health:   http://localhost:${PORT}/health`);
  console.log(`   API Docs: http://localhost:${PORT}/`);
  console.log('');
  console.log('   Database: In-Memory (No setup needed!)');
  console.log('');
  console.log('============================================');
  console.log('');
  
  // Add some sample data
  console.log('Adding sample data...');
  
  // Sample user
  const sampleUser = {
    id: '1',
    email: 'demo@example.com',
    password: '$2a$10$YKtqKJM3/2CqJQnzKL5Fxu7hGqVyRzK.8sV6jO4wYKMhNxTmNJGzK', // password: demo123
    firstName: 'Demo',
    lastName: 'User',
    role: 'OWNER',
    organizationName: 'Demo Company',
    createdAt: new Date().toISOString()
  };
  database.users.push(sampleUser);
  
  // Sample projects
  database.projects.push(
    {
      id: '1',
      name: 'Smith Wedding',
      status: 'ACTIVE',
      clientName: 'John & Jane Smith',
      eventDate: '2024-06-15',
      budget: 50000,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Johnson Event',
      status: 'PLANNING',
      clientName: 'Mike Johnson',
      eventDate: '2024-07-20',
      budget: 35000,
      createdAt: new Date().toISOString()
    }
  );
  
  // Sample leads
  database.leads.push(
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah@example.com',
      phone: '555-0123',
      status: 'NEW',
      eventDate: '2024-09-10',
      budget: 40000,
      createdAt: new Date().toISOString()
    }
  );
  
  // Sample tasks
  database.tasks.push(
    {
      id: '1',
      title: 'Book venue',
      projectId: '1',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: '2024-03-01',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Send invitations',
      projectId: '1',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: '2024-04-15',
      createdAt: new Date().toISOString()
    }
  );
  
  console.log('Sample data added!');
  console.log('');
  console.log('Demo credentials:');
  console.log('Email: demo@example.com');
  console.log('Password: demo123');
  console.log('');
});

module.exports = app;
