@echo off
echo.
echo ============================================
echo    RUBAN BLEU PLANNING SUITE - DEV MODE
echo ============================================
echo.

:: Start API server in a new window
echo Starting API server on port 3001...
start "API Server" cmd /k "cd apps\api && npm start"

:: Wait a moment for API to start
timeout /t 3 /nobreak > nul

:: Start Web frontend in a new window
echo Starting Web frontend on port 3000...
start "Web Frontend" cmd /k "cd apps\web && npm run dev"

echo.
echo ============================================
echo    SERVERS STARTING...
echo ============================================
echo.
echo API Server:   http://localhost:3001
echo Web Frontend: http://localhost:3000
echo.
echo Demo Credentials:
echo Email: demo@example.com
echo Password: demo123
echo.
echo Press any key to open the web app in your browser...
pause > nul

:: Open browser
start http://localhost:3000

echo.
echo Both servers are running in separate windows.
echo Close this window when done.
pause
