import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (no database needed)
let users = [];
let projects = [];

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'API is running without database'
  });
});

// Simple auth routes (no database)
app.post('/api/v1/auth/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  // Check if user exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  // Create user in memory
  const user = {
    id: Date.now().toString(),
    email,
    password, // In production, this should be hashed
    firstName,
    lastName,
    createdAt: new Date()
  };
  
  users.push(user);
  
  res.json({
    status: 'success',
    data: {
      user: { id: user.id, email, firstName, lastName },
      token: 'fake-jwt-token-' + user.id
    }
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({
    status: 'success',
    data: {
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName 
      },
      token: 'fake-jwt-token-' + user.id
    }
  });
});

// Get all users (for testing)
app.get('/api/v1/users', (req, res) => {
  res.json({
    status: 'success',
    data: users.map(u => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName
    }))
  });
});

// Simple project routes
app.get('/api/v1/projects', (req, res) => {
  res.json({
    status: 'success',
    data: projects
  });
});

app.post('/api/v1/projects', (req, res) => {
  const project = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };
  
  projects.push(project);
  
  res.json({
    status: 'success',
    data: project
  });
});

// Start server
app.listen(PORT, () => {
  console.log('============================================');
  console.log('   API SERVER RUNNING (No Database Mode)');
  console.log('============================================');
  console.log(`API URL: http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('Test Endpoints:');
  console.log(`POST http://localhost:${PORT}/api/v1/auth/register`);
  console.log(`POST http://localhost:${PORT}/api/v1/auth/login`);
  console.log(`GET  http://localhost:${PORT}/api/v1/users`);
  console.log(`GET  http://localhost:${PORT}/api/v1/projects`);
  console.log('============================================');
});
