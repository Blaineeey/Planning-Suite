# 🔧 TROUBLESHOOTING GUIDE

## Common Issues and Solutions

### 1. Can't Login

**Symptoms:**
- Login button doesn't work
- Getting authentication errors
- Redirected back to login page

**Solutions:**

1. **Check if API is running:**
   - Open http://localhost:3001/health
   - Should see a JSON response with `status: "ok"`

2. **Test the API directly:**
   - Go to http://localhost:3000/test
   - Click "Test Login" button
   - Should see a success response with token

3. **Clear browser data:**
   ```javascript
   // Open browser console (F12) and run:
   localStorage.clear();
   ```

4. **Check console for errors:**
   - Open browser DevTools (F12)
   - Look for red error messages in Console tab
   - Check Network tab for failed requests

### 2. API Not Responding

**Symptoms:**
- API status shows "Error" or "Disconnected"
- Cannot fetch data

**Solutions:**

1. **Start API manually:**
   ```bash
   cd apps/api
   npm install
   node server.js
   ```

2. **Check if port 3001 is in use:**
   ```bash
   netstat -an | findstr :3001
   ```
   If port is busy, kill the process or change the port in server.js

3. **Check Node.js version:**
   ```bash
   node --version
   ```
   Should be v20.0.0 or higher

### 3. Frontend Not Loading

**Symptoms:**
- Page is blank
- Getting build errors
- Components not rendering

**Solutions:**

1. **Install dependencies:**
   ```bash
   cd apps/web
   npm install
   ```

2. **Clear Next.js cache:**
   ```bash
   cd apps/web
   rm -rf .next
   npm run dev
   ```

3. **Check for missing imports:**
   - Ensure all components are properly imported
   - Check that Zustand is installed: `npm install zustand`

### 4. CORS Errors

**Symptoms:**
- "Access-Control-Allow-Origin" errors in console
- API calls blocked by browser

**Solutions:**

1. **Check CORS configuration in server.js:**
   ```javascript
   app.use(cors({
     origin: ['http://localhost:3000', 'http://localhost:3001'],
     credentials: true
   }));
   ```

2. **Ensure API URL is correct:**
   - Should be `http://localhost:3001` (not https)
   - Check `NEXT_PUBLIC_API_URL` in .env file

### 5. Dashboard Not Loading After Login

**Symptoms:**
- Stuck on loading screen
- White page after login
- Console errors about missing data

**Solutions:**

1. **Check authentication token:**
   ```javascript
   // In browser console:
   console.log(localStorage.getItem('auth_token'));
   ```

2. **Verify API routes are working:**
   - Test: http://localhost:3001/api/stats/overview
   - Test: http://localhost:3001/api/projects

3. **Check middleware.js:**
   - Ensure it's not blocking authenticated routes
   - Comment out middleware temporarily to test

## Quick Start Steps

### Method 1: Using Batch File
```bash
# Simply double-click:
START-DEV.bat
```

### Method 2: Manual Start

**Terminal 1 - API Server:**
```bash
cd apps/api
npm install
node server.js
```

**Terminal 2 - Web App:**
```bash
cd apps/web
npm install
npm run dev
```

### Method 3: Using npm scripts
```bash
# From root directory:
npm install
npm run dev
```

## Test Sequence

1. **Test API Health:**
   - Go to: http://localhost:3001/health
   - Expected: JSON with status "ok"

2. **Test API Root:**
   - Go to: http://localhost:3001
   - Expected: API documentation

3. **Test Frontend:**
   - Go to: http://localhost:3000/test
   - Click "Check API Health"
   - Click "Test Login"

4. **Try Login:**
   - Go to: http://localhost:3000/login
   - Email: demo@example.com
   - Password: demo123

## File Structure Check

Ensure these files exist:
```
apps/
├── api/
│   ├── server.js
│   ├── package.json
│   ├── models/
│   │   └── database.js
│   └── routes/
│       ├── crm.js
│       ├── projects.js
│       ├── guests.js
│       ├── vendors.js
│       ├── websites.js
│       └── shop.js
└── web/
    ├── package.json
    ├── next.config.ts
    └── src/
        ├── app/
        │   ├── page.tsx
        │   ├── login/
        │   │   └── page.jsx
        │   ├── register/
        │   │   └── page.jsx
        │   ├── dashboard/
        │   │   └── page.jsx
        │   └── test/
        │       └── page.jsx
        ├── components/
        │   └── DashboardLayout.jsx
        ├── lib/
        │   └── api.js
        └── store/
            └── authStore.js
```

## Environment Variables

Create `.env.local` in `apps/web/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Dependencies Check

**API Dependencies:**
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.3.1"
}
```

**Web Dependencies:**
```json
{
  "next": "15.5.2",
  "react": "19.1.0",
  "zustand": "^5.0.8",
  "lucide-react": "^0.542.0"
}
```

## Common Commands

**Kill process on port:**
```bash
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3001
kill -9 <PID>
```

**Clear npm cache:**
```bash
npm cache clean --force
```

**Reinstall all dependencies:**
```bash
# From root:
rm -rf node_modules package-lock.json
rm -rf apps/api/node_modules apps/api/package-lock.json
rm -rf apps/web/node_modules apps/web/package-lock.json
npm install
cd apps/api && npm install
cd ../web && npm install
```

## Debug Mode

To see more detailed errors, set environment variable:
```bash
# Windows:
set DEBUG=*

# Mac/Linux:
export DEBUG=*
```

## Contact Support

If issues persist:
1. Check browser console for errors (F12)
2. Check terminal for server errors
3. Try incognito/private browsing mode
4. Restart your computer and try again

## Working Demo Credentials

```
Email: demo@example.com
Password: demo123
```

These credentials are pre-seeded in the database when the API starts.
