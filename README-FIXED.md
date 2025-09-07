# Ruban Bleu Planning Suite

A comprehensive wedding planning platform with CRM, project management, and vendor coordination capabilities.

## ✅ Fixed Issues

The Planning Suite has been updated with the following fixes:

1. **API Dependencies**: Added proper package.json for the API server with all required dependencies
2. **Docker Configuration**: Updated Dockerfiles to ensure proper dependency installation
3. **Dashboard Page**: Created a fully functional dashboard with statistics and data visualization
4. **Improved Startup Scripts**: Created better batch files with error handling
5. **Application Metadata**: Updated page titles and descriptions

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
# Run the main startup script
START.bat
```

### Option 2: Without Docker
```bash
# Run the simple startup script (requires Node.js 20+)
START-SIMPLE.bat
```

### Option 3: Manual Start
```bash
# Terminal 1 - Start API
cd apps/api
npm install
node server.js

# Terminal 2 - Start Web App
cd apps/web
npm install
npm run dev
```

## 🔧 Troubleshooting

Run the troubleshooting script to check your system:
```bash
TROUBLESHOOT.bat
```

### Common Issues and Solutions:

1. **Docker not found**
   - Install Docker Desktop from https://docker.com
   - Make sure Docker Desktop is running
   - Use START-SIMPLE.bat instead if you don't want to use Docker

2. **Port already in use**
   - Stop other applications using ports 3000 or 3001
   - Or modify the ports in the configuration files

3. **API not responding**
   - Wait 30-60 seconds after starting for services to initialize
   - Check if Node.js is installed (version 20 or higher)
   - Try restarting the services

4. **Build failures**
   - Clear Docker cache: `docker-compose down && docker-compose build --no-cache`
   - Check internet connection for package downloads
   - Ensure sufficient disk space

## 📁 Project Structure

```
Planning-Suite/
├── apps/
│   ├── api/              # Express.js API server
│   │   ├── server.js     # Main API server file
│   │   ├── package.json  # API dependencies
│   │   └── Dockerfile    # API container config
│   │
│   └── web/              # Next.js web application
│       ├── src/
│       │   └── app/
│       │       ├── page.tsx         # Home page
│       │       ├── dashboard/       # Dashboard page
│       │       └── layout.tsx       # App layout
│       ├── package.json
│       └── Dockerfile
│
├── docker-compose.yml    # Docker services configuration
├── START.bat            # Main startup script (Docker)
├── START-SIMPLE.bat     # Simple startup (no Docker)
└── TROUBLESHOOT.bat     # System check script
```

## 🌐 Available Endpoints

### Web Application
- **Home**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard

### API Server
- **Health Check**: http://localhost:3001/health
- **API Info**: http://localhost:3001

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/leads` - List all leads
- `POST /api/leads` - Create new lead
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create new invoice
- `GET /api/stats` - Get statistics

## 🔐 Demo Credentials

```
Email: demo@example.com
Password: demo123
```

## 🛠 Technology Stack

- **Frontend**: Next.js 15.5, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: In-memory (no external database required)
- **Authentication**: JWT
- **Containerization**: Docker, Docker Compose

## 📊 Features

### Current Features
- ✅ User authentication (register/login)
- ✅ Project management
- ✅ Lead tracking
- ✅ Task management
- ✅ Invoice creation
- ✅ Dashboard with statistics
- ✅ RESTful API
- ✅ In-memory database (no setup required)

### Coming Soon
- 🔄 Guest list management
- 🔄 Vendor directory
- 🔄 Email notifications
- 🔄 Calendar integration
- 🔄 Document storage
- 🔄 Custom wedding websites

## 🔍 System Requirements

### Minimum Requirements
- Windows 10 or higher
- Node.js 20.0.0 or higher
- 4GB RAM
- 2GB free disk space

### Recommended
- Docker Desktop installed
- 8GB RAM
- 5GB free disk space

## 📝 Development

### Install Dependencies
```bash
# Root level
npm install

# API
cd apps/api
npm install

# Web
cd apps/web
npm install
```

### Run in Development Mode
```bash
# With Docker
docker-compose up

# Without Docker
npm run dev
```

### Build for Production
```bash
# With Docker
docker-compose build

# Without Docker
npm run build
```

## 🐛 Known Issues

1. **First-time startup**: Initial Docker build may take 2-5 minutes
2. **Hot reload**: May need manual refresh in development mode
3. **Memory usage**: Docker Desktop should have at least 4GB allocated

## 📞 Support

If you encounter any issues:

1. Run `TROUBLESHOOT.bat` to check system status
2. Check the logs:
   - API logs: `docker-compose logs api`
   - Web logs: `docker-compose logs web`
3. Restart services: `docker-compose restart`
4. Rebuild if needed: `docker-compose build --no-cache`

## 📄 License

This project is proprietary software. All rights reserved.

---

**Version**: 1.0.0
**Last Updated**: September 2025
**Status**: ✅ Fixed and Ready to Use
