@echo off
cls
echo ============================================================
echo     RUBAN BLEU - SIMPLE START (No Docker Required)
echo ============================================================
echo.

cd /d "C:\Users\blain\Desktop\Planning-Suite"

echo This will start the services without Docker.
echo Make sure Node.js 20+ is installed.
echo.

echo Starting API Server...
start "API Server" cmd /k "cd apps\api && npm install && node server.js"

echo.
echo Waiting 5 seconds for API to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Web Application...
start "Web Application" cmd /k "cd apps\web && npm install && npm run dev"

echo.
echo ============================================================
echo     Services should be starting...
echo ============================================================
echo.
echo   API Server:   http://localhost:3001
echo   Web App:      http://localhost:3000
echo.
echo   Demo Login:
echo   Email: demo@example.com
echo   Password: demo123
echo.
echo ============================================================
echo.
echo Opening browser in 10 seconds...
timeout /t 10 /nobreak >nul

start http://localhost:3001/health
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo Press any key to exit...
pause >nul
