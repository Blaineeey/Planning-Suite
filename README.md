# Ruban Bleu Planning Suite

A comprehensive event planning platform with CRM, project management, guest management, vendor directory, website generator, and digital shop.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Planning-Suite
```

2. Install dependencies for both frontend and backend:
```bash
# Install API dependencies
cd apps/api
npm install

# Install Web dependencies  
cd ../web
npm install
```

### Running the Application

#### Option 1: Using the Start Script (Windows)
Simply double-click `start-dev.bat` in the root directory or run:
```bash
start-dev.bat
```

#### Option 2: Manual Start

1. Start the API server (in one terminal):
```bash
cd apps/api
npm start
```
The API will run on http://localhost:3001

2. Start the Web frontend (in another terminal):
```bash
cd apps/web
npm run dev
```
The frontend will run on http://localhost:3000

## 🔐 Demo Credentials

- **Email:** demo@example.com
- **Password:** demo123

## 🧪 Testing the Connection

1. Open http://localhost:3000 in your browser
2. Click "Test API Connection" on the login page to verify the backend is running
3. Log in with the demo credentials

## 📁 Project Structure

```
Planning-Suite/
├── apps/
│   ├── api/          # Backend API (Express.js)
│   │   ├── models/   # Database models
│   │   ├── routes/   # API routes
│   │   └── server.js # Main server file
│   └── web/          # Frontend (Next.js)
│       ├── src/
│       │   ├── app/      # Pages and routes
│       │   ├── components/
│       │   ├── lib/      # API client
│       │   └── store/    # State management
│       └── package.json
├── start-dev.bat     # Development startup script
└── README.md
```

## 🎨 Features

### Core Modules
- ✅ **CRM & Sales** - Lead management, proposals, contracts, invoices
- ✅ **Project Management** - Wedding planning tools, checklists, timelines
- ✅ **Guest Management** - RSVP, seating charts, meal preferences
- ✅ **Vendor Directory** - Vendor portal, reviews, bookings
- ✅ **Website Generator** - Custom wedding websites with RSVP
- ✅ **Digital Shop** - Sell templates and digital products
- ✅ **Automations** - Workflow automation and email templates

## 🛠️ Technology Stack

### Frontend
- Next.js 15
- React 19
- TailwindCSS
- Zustand (State Management)

### Backend  
- Node.js
- Express.js
- JWT Authentication
- In-memory database (development)
- bcrypt for password hashing

## 🔧 Troubleshooting

### Cannot connect to API
- Ensure the API server is running on port 3001
- Check if another application is using port 3001
- Verify the `.env` file exists in `apps/api/`

### Login not working
- Make sure both servers are running
- Check browser console for errors
- Verify you're using the correct credentials

### Input text not visible
- This has been fixed with proper CSS styling
- Clear browser cache if the issue persists

## 📝 Environment Variables

### API (.env)
```
PORT=3001
NODE_ENV=development
JWT_SECRET=development-secret-key-change-in-production
```

### Web (.env.local) - Optional
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Production Deployment

For production deployment:
1. Update JWT_SECRET to a secure random string
2. Set up a proper database (PostgreSQL, MySQL, MongoDB)
3. Configure environment variables
4. Set up HTTPS
5. Use a process manager like PM2

## 📄 License

Copyright © 2024 Ruban Bleu Planning Suite
