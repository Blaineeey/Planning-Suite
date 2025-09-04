const express = require('express');
const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is working!',
    endpoints: {
      health: 'http://localhost:3001/health',
      test: 'http://localhost:3001/test'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working!' });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'API root endpoint' });
});

app.get('/api/v1', (req, res) => {
  res.json({ message: 'API v1 endpoint' });
});

app.get('/api/v1/test', (req, res) => {
  res.json({ message: 'API v1 test endpoint working!' });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('============================================');
  console.log('   SERVER IS RUNNING SUCCESSFULLY!');
  console.log('============================================');
  console.log('');
  console.log('Test these URLs in your browser:');
  console.log('');
  console.log('1. http://localhost:3001/');
  console.log('2. http://localhost:3001/health');
  console.log('3. http://localhost:3001/test');
  console.log('');
  console.log('============================================');
  console.log('');
});
