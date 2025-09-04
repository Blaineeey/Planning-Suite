const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Ruban Bleu API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: {
        register: '/api/auth/register',
        login: '/api/auth/login'
      },
      projects: '/api/projects',
      leads: '/api/leads'
    }
  });
});

// Health check with database connection
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({ 
      status: 'ok',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, organizationName } = req.body;
    
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create organization if provided
    let organization = null;
    if (organizationName) {
      organization = await prisma.organization.create({
        data: {
          name: organizationName,
          slug: organizationName.toLowerCase().replace(/\s+/g, '-')
        }
      });
    }
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        organizationId: organization?.id
      }
    });
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        planner: true,
        organization: true
      }
    });
    res.json(projects);
  } catch (error) {
    res.json([]);
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = await prisma.project.create({
      data: req.body
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Leads
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        organization: true,
        assignedUser: true
      }
    });
    res.json(leads);
  } catch (error) {
    res.json([]);
  }
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('============================================');
      console.log('   RUBAN BLEU API SERVER');
      console.log('============================================');
      console.log(`   Running on: http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/health`);
      console.log('============================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    // Start server anyway without database
    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('============================================');
      console.log('   API SERVER (No Database)');
      console.log('============================================');
      console.log(`   Running on: http://localhost:${PORT}`);
      console.log('============================================');
      console.log('');
    });
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
