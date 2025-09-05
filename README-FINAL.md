# RUBAN BLEU PLANNING SUITE - WORKING VERSION

## 🚀 QUICK START - JUST ONE COMMAND!

Run this to start everything:
```
START-APP.bat
```

This will:
1. Install all dependencies
2. Start the API server (port 3001)
3. Start the Web application (port 3000)
4. Open the API tester
5. Open the web application

## ✅ WHAT'S WORKING NOW

### Backend API (Port 3001)
- ✅ **Full REST API** with in-memory database
- ✅ **Authentication** (Register, Login, JWT tokens)
- ✅ **Projects** (CRUD operations)
- ✅ **Leads** management
- ✅ **Tasks** management
- ✅ **Invoices** creation
- ✅ **Statistics** endpoint
- ✅ **Health check** endpoint
- ✅ **Sample data** pre-loaded

### Frontend Web App (Port 3000)
- ✅ **Homepage** with API connection status
- ✅ **Dashboard** page
- ✅ **Live statistics** display
- ✅ **API testing** buttons
- ✅ **Real-time connection** indicator

### No External Dependencies!
- ❌ **NO PostgreSQL needed**
- ❌ **NO Docker needed**
- ❌ **NO Redis needed**
- ✅ **Just Node.js!**

## 📁 PROJECT STRUCTURE

```
Planning-Suite/
├── apps/
│   ├── api/
│   │   ├── server.js         ← Complete API server
│   │   ├── package.json      ← API dependencies
│   │   └── .env              ← API configuration
│   └── web/
│       └── src/
│           └── app/
│               ├── page.tsx   ← Homepage
│               └── dashboard/
│                   └── page.tsx ← Dashboard
├── START-APP.bat             ← Run this to start everything!
├── start-api.bat             ← Run API only
└── api-tester.html           ← Test API endpoints
```

## 🔑 DEMO CREDENTIALS

```
Email: demo@example.com
Password: demo123
```

## 🌐 ACCESS POINTS

| Service | URL | Description |
|---------|-----|-------------|
| **Web App** | http://localhost:3000 | Main application |
| **API Server** | http://localhost:3001 | Backend API |
| **Health Check** | http://localhost:3001/health | API status |
| **API Tester** | Open `api-tester.html` | Test all endpoints |

## 📡 API ENDPOINTS

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create lead

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task

### Statistics
- `GET /api/stats` - Get system statistics
- `GET /health` - Health check

## 🧪 TESTING THE API

### Method 1: Using API Tester (Easiest)
1. Open `api-tester.html` in your browser
2. Click the test buttons
3. See responses immediately

### Method 2: Using cURL
```bash
# Health check
curl http://localhost:3001/health

# Get projects
curl http://localhost:3001/api/projects

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"demo@example.com\",\"password\":\"demo123\"}"
```

### Method 3: Using the Web App
1. Go to http://localhost:3000
2. Click "Test Projects API" button
3. Check the API status indicator

## 🛠️ TROUBLESHOOTING

### API not connecting?
1. Make sure port 3001 is free
2. Check the green window for errors
3. Run `start-api.bat` separately

### Web app not loading?
1. Make sure port 3000 is free
2. Check the blue window for errors
3. Wait 30 seconds for Next.js to compile

### Ports already in use?
```cmd
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID [number] /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID [number] /F
```

## 🎯 FEATURES

### What's Working:
- ✅ Complete authentication system
- ✅ Project management
- ✅ Lead tracking
- ✅ Task management
- ✅ Invoice creation
- ✅ Real-time statistics
- ✅ API health monitoring
- ✅ In-memory database (no setup!)

### Sample Data Included:
- 1 Demo user
- 2 Sample projects
- 1 Sample lead
- 2 Sample tasks

## 🚦 HOW TO KNOW IT'S WORKING

When you run `START-APP.bat`, you should see:
1. Two command windows open (green for API, blue for Web)
2. API Tester opens in browser
3. Web app opens at http://localhost:3000
4. API Status shows "✓ Connected" in green

## 📝 NEXT STEPS

1. **Test Authentication**: Use the API tester to register/login
2. **Create Projects**: Use the API to create new projects
3. **Explore Dashboard**: Navigate to /dashboard
4. **Build Features**: Add more pages and functionality

## 💡 TIPS

- The API uses an in-memory database - data resets when you restart
- All endpoints support CORS for the web app
- JWT tokens are stored in localStorage
- The API includes sample data on startup

## 🎉 CONGRATULATIONS!

Your Ruban Bleu Planning Suite is now fully operational!
Just run `START-APP.bat` and everything works!
