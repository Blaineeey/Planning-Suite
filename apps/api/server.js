const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import database and routes
const db = require('./models/database');
const crmRoutes = require('./routes/crm');
const projectRoutes = require('./routes/projects');
const guestRoutes = require('./routes/guests');
const vendorRoutes = require('./routes/vendors');
const websiteRoutes = require('./routes/websites');
const shopRoutes = require('./routes/shop');
// const paymentRoutes = require('./routes/payments');
// const esignatureRoutes = require('./routes/esignature');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // For production, you'd want to be more restrictive
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests
app.options('*', cors());

// ==================== ROOT ROUTES ====================

app.get('/', (req, res) => {
  res.json({ 
    message: 'Ruban Bleu Planning Suite API',
    status: 'running',
    version: '2.0.0',
    modules: {
      crm: 'CRM & Sales (HoneyBook parity)',
      projects: 'Project & Wedding Management (Aisle Planner parity)',
      guests: 'Guest Management & RSVP',
      vendors: 'Vendor Directory & Portal',
      websites: 'Wedding Website Generator',
      shop: 'Digital Products Shop',
      automations: 'Workflows & Automations'
    },
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      crm: '/api/crm/*',
      projects: '/api/projects/*',
      guests: '/api/guests/*',
      vendors: '/api/vendors/*',
      websites: '/api/websites/*',
      shop: '/api/shop/*',
      public: '/api/public/*'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const collections = Object.keys(db.database);
  const stats = {};
  
  collections.forEach(collection => {
    stats[collection] = db.database[collection].length;
  });
  
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'in-memory',
    collections: collections.length,
    stats
  });
});

// ==================== AUTH ROUTES ====================

// Debug endpoint to check demo user
app.get('/api/auth/debug', async (req, res) => {
  const users = db.database.users;
  const demoUser = users.find(u => u.email === 'demo@example.com');
  
  if (demoUser) {
    // Test password validation
    const testPassword = 'demo123';
    const isValid = await bcrypt.compare(testPassword, demoUser.password);
    
    res.json({
      userExists: true,
      email: demoUser.email,
      firstName: demoUser.firstName,
      lastName: demoUser.lastName,
      passwordValidation: isValid,
      passwordHashLength: demoUser.password.length,
      totalUsers: users.length,
      message: isValid ? 'Password validation successful!' : 'Password validation failed'
    });
  } else {
    res.json({
      userExists: false,
      totalUsers: users.length,
      message: 'Demo user not found'
    });
  }
});

// Register organization owner
app.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      organizationName,
      phone
    } = req.body;
    
    // Check if user exists
    const existingUser = db.findAll('users', { email })[0];
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create organization
    const organization = db.create('organizations', {
      name: organizationName,
      email,
      phone,
      primaryColor: '#e91e63',
      secondaryColor: '#f8bbd0',
      subdomain: db.generateSlug(organizationName),
      currency: 'USD',
      timezone: 'America/New_York',
      subscription: {
        plan: 'trial',
        status: 'active',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
      },
      settings: {
        features: {
          crm: true,
          projects: true,
          guests: true,
          vendors: true,
          websites: true,
          shop: true
        }
      }
    });
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = db.create('users', {
      organizationId: organization.id,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: 'OWNER',
      permissions: ['all'],
      isActive: true,
      emailVerified: false
    });
    
    // Generate token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        organizationId: organization.id,
        role: user.role
      },
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
      organization: {
        id: organization.id,
        name: organization.name,
        subdomain: organization.subdomain
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
    const user = db.findAll('users', { email })[0];
    
    console.log('Login attempt:', { email, userFound: !!user });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    
    // Debug log
    console.log('Password validation:', { 
      email: user.email,
      validPassword,
      passwordLength: password.length,
      hashLength: user.password.length 
    });
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Get organization
    const organization = db.findById('organizations', user.organizationId);
    
    // Generate token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        organizationId: user.organizationId,
        role: user.role
      },
      process.env.JWT_SECRET || 'development-secret-key',
      { expiresIn: '7d' }
    );
    
    // Update last login
    db.update('users', user.id, { lastLogin: new Date().toISOString() });
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      organization,
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
    const user = db.findById('users', decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const organization = db.findById('organizations', user.organizationId);
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      organization
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ==================== MOUNT ROUTES ====================

app.use('/api/crm', crmRoutes);
app.use('/api', projectRoutes); // Projects routes include /projects prefix
app.use('/api', guestRoutes); // Guests routes include various prefixes
app.use('/api', vendorRoutes); // Vendors routes
app.use('/api', websiteRoutes); // Website routes
app.use('/api', shopRoutes); // Shop routes
// app.use('/api', paymentRoutes); // Payment routes - disabled until Stripe is installed
// app.use('/api', esignatureRoutes); // E-signature routes - disabled until dependencies installed

// ==================== STATISTICS ENDPOINT ====================

app.get('/api/stats/overview', (req, res) => {
  res.json({
    organizations: db.database.organizations.length,
    users: db.database.users.length,
    projects: db.database.projects.length,
    leads: db.database.leads.length,
    guests: db.database.guests.length,
    vendors: db.database.vendors.length,
    websites: db.database.weddingWebsites.length,
    products: db.database.products.length,
    orders: db.database.orders.length,
    revenue: db.database.invoices
      .filter(i => i.status === 'PAID')
      .reduce((sum, i) => sum + (i.total || 0), 0)
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
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

// ==================== INITIALIZE WITH SAMPLE DATA ====================

async function initializeSampleData() {
  console.log('Initializing sample data...');
  
  // Create demo organization
  const demoOrg = db.create('organizations', {
    name: 'Demo Wedding Planning Co',
    email: 'demo@rubanbleu.com',
    phone: '555-0123',
    primaryColor: '#e91e63',
    secondaryColor: '#f8bbd0',
    subdomain: 'demo',
    currency: 'USD',
    timezone: 'America/New_York',
    subscription: {
      plan: 'premium',
      status: 'active'
    }
  });
  
  // Create demo user with properly hashed password
  const hashedDemoPassword = await bcrypt.hash('demo123', 10);
  console.log('Creating demo user with hashed password...');
  
  const demoUser = db.create('users', {
    organizationId: demoOrg.id,
    email: 'demo@example.com',
    password: hashedDemoPassword, // Properly hashed demo123
    firstName: 'Demo',
    lastName: 'User',
    role: 'OWNER',
    permissions: ['all'],
    isActive: true
  });
  
  // Create sample leads
  const leads = [
    {
      organizationId: demoOrg.id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@example.com',
      phone: '555-0101',
      source: 'Website',
      status: 'NEW',
      eventDate: '2025-06-15',
      eventType: 'Wedding',
      budget: 50000,
      guestCount: 150,
      venue: 'Grand Ballroom'
    },
    {
      organizationId: demoOrg.id,
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael@example.com',
      phone: '555-0102',
      source: 'Referral',
      status: 'PROPOSAL',
      eventDate: '2025-08-20',
      eventType: 'Wedding',
      budget: 75000,
      guestCount: 200,
      venue: 'Beach Resort'
    }
  ];
  
  leads.forEach(lead => db.create('leads', lead));
  
  // Create sample project
  const project = db.create('projects', {
    organizationId: demoOrg.id,
    clientId: demoUser.id,
    name: 'Smith-Wilson Wedding',
    type: 'WEDDING',
    status: 'ACTIVE',
    eventDate: '2025-07-15',
    venue: {
      name: 'Sunset Gardens',
      address: '123 Wedding Lane, Beverly Hills, CA',
      capacity: 200
    },
    guestCount: 175,
    budget: 60000,
    package: 'Premium'
  });
  
  // Create sample vendors
  const vendorCategories = ['Photography', 'Catering', 'Florist', 'Music/DJ', 'Venue'];
  vendorCategories.forEach((category, index) => {
    db.create('vendors', {
      organizationId: demoOrg.id,
      name: `${category} Excellence`,
      category,
      email: `${category.toLowerCase()}@vendor.com`,
      phone: `555-020${index}`,
      website: `www.${category.toLowerCase()}.com`,
      priceRange: '$$$',
      description: `Premium ${category} services for your special day`,
      rating: 4.5 + (Math.random() * 0.5),
      featured: index < 2,
      verified: true,
      status: 'ACTIVE'
    });
  });
  
  // Create sample products for shop
  const products = [
    {
      organizationId: demoOrg.id,
      name: 'Complete Wedding Planning Template',
      slug: 'complete-wedding-planning-template',
      category: 'Wedding Planning Templates',
      type: 'DIGITAL_DOWNLOAD',
      description: 'Everything you need to plan the perfect wedding',
      price: 49.99,
      featured: true,
      status: 'ACTIVE',
      sales: 45
    },
    {
      organizationId: demoOrg.id,
      name: 'Vendor Contract Bundle',
      slug: 'vendor-contract-bundle',
      category: 'Contracts & Legal',
      type: 'DIGITAL_DOWNLOAD',
      description: '10 essential vendor contract templates',
      price: 79.99,
      featured: true,
      status: 'ACTIVE',
      sales: 32
    },
    {
      organizationId: demoOrg.id,
      name: 'Wedding Day Timeline Template',
      slug: 'wedding-day-timeline',
      category: 'Timeline Templates',
      type: 'DIGITAL_DOWNLOAD',
      description: 'Customizable wedding day timeline',
      price: 29.99,
      status: 'ACTIVE',
      sales: 67
    },
    {
      organizationId: demoOrg.id,
      name: 'Budget Tracker Spreadsheet',
      slug: 'budget-tracker',
      category: 'Budget Templates',
      type: 'DIGITAL_DOWNLOAD',
      description: 'Comprehensive wedding budget tracking tool',
      price: 39.99,
      status: 'ACTIVE',
      sales: 89
    }
  ];
  
  products.forEach(product => db.create('products', product));
  
  // Create sample guests for the project
  const guestNames = [
    { firstName: 'John', lastName: 'Smith', side: 'BRIDE' },
    { firstName: 'Jane', lastName: 'Doe', side: 'GROOM' },
    { firstName: 'Bob', lastName: 'Johnson', side: 'BRIDE' },
    { firstName: 'Alice', lastName: 'Williams', side: 'GROOM' },
    { firstName: 'Charlie', lastName: 'Brown', side: 'BOTH' }
  ];
  
  guestNames.forEach(guest => {
    db.create('guests', {
      projectId: project.id,
      ...guest,
      email: `${guest.firstName.toLowerCase()}@example.com`,
      rsvpStatus: Math.random() > 0.3 ? 'YES' : 'PENDING',
      rsvpCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      ageGroup: 'ADULT',
      mealSelection: ['Beef', 'Chicken', 'Fish'][Math.floor(Math.random() * 3)]
    });
  });
  
  // Create sample tasks
  const taskTitles = [
    'Book ceremony venue',
    'Send save the dates',
    'Finalize guest list',
    'Choose wedding cake',
    'Book photographer',
    'Select wedding flowers',
    'Plan honeymoon',
    'Order invitations'
  ];
  
  taskTitles.forEach((title, index) => {
    db.create('tasks', {
      projectId: project.id,
      title,
      status: index < 3 ? 'COMPLETED' : index < 5 ? 'IN_PROGRESS' : 'TODO',
      priority: index < 2 ? 'HIGH' : index < 5 ? 'MEDIUM' : 'LOW',
      dueDate: new Date(Date.now() + (index * 7 * 24 * 60 * 60 * 1000)).toISOString()
    });
  });
  
  // Create sample wedding website
  const website = db.create('weddingWebsites', {
    projectId: project.id,
    subdomain: 'smith-wilson',
    url: 'https://weddings.rubanbleu.com/smith-wilson',
    templateId: 'elegant',
    theme: {
      primaryColor: '#e91e63',
      secondaryColor: '#f8bbd0',
      fontFamily: 'Playfair Display',
      backgroundStyle: 'floral'
    },
    coupleNames: {
      person1: 'Emily Smith',
      person2: 'James Wilson'
    },
    story: 'Our love story began in college...',
    eventDetails: {
      date: '2025-07-15',
      time: '4:00 PM',
      venue: {
        name: 'Sunset Gardens',
        address: '123 Wedding Lane, Beverly Hills, CA'
      }
    },
    pages: ['home', 'our-story', 'schedule', 'venue', 'rsvp', 'registry'],
    isPublished: true,
    rsvpEnabled: true,
    rsvpDeadline: '2025-06-15',
    privacy: 'PUBLIC'
  });
  
  console.log('Sample data initialized successfully!');
  console.log('Demo credentials:');
  console.log('Email: demo@example.com');
  console.log('Password: demo123');
}

// ==================== START SERVER ====================

app.listen(PORT, '0.0.0.0', async () => {
  console.log('');
  console.log('============================================');
  console.log('   RUBAN BLEU PLANNING SUITE API');
  console.log('============================================');
  console.log('');
  console.log(`   Version: 2.0.0`);
  console.log(`   Status:  RUNNING`);
  console.log('');
  console.log(`   Local:    http://localhost:${PORT}`);
  console.log(`   Network:  http://0.0.0.0:${PORT}`);
  console.log('');
  console.log('   Core Modules:');
  console.log('   ✓ CRM & Sales (HoneyBook parity)');
  console.log('   ✓ Project Management (Aisle Planner parity)');
  console.log('   ✓ Guest Management & RSVP');
  console.log('   ✓ Vendor Directory & Portal');
  console.log('   ✓ Wedding Website Generator');
  console.log('   ✓ Digital Products Shop');
  console.log('   ✓ Workflows & Automations');
  console.log('');
  console.log('   API Documentation: http://localhost:' + PORT);
  console.log('   Health Check:      http://localhost:' + PORT + '/health');
  console.log('');
  console.log('============================================');
  console.log('');
  
  // Initialize sample data
  await initializeSampleData();
  
  console.log('');
  console.log('============================================');
  console.log('   READY TO ACCEPT REQUESTS');
  console.log('============================================');
  console.log('');
});

module.exports = app;
