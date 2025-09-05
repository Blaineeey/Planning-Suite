@echo off
cls
echo ============================================================
echo     RUBAN BLEU - COMPLETE APPLICATION STARTUP
echo ============================================================
echo.

cd C:\Users\blain\Desktop\Planning-Suite

REM Kill any existing Node processes
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 >nul

echo Step 1: Starting API Server...
echo --------------------------------
cd apps\api
if not exist node_modules (
    echo Installing API dependencies...
    call npm install express cors bcryptjs jsonwebtoken dotenv
)
start "API Server - Port 3001" cmd /k "color 0A && cls && echo RUBAN BLEU API SERVER && echo ===================== && echo. && echo Starting on port 3001... && echo. && node server.js"

cd ..\..
timeout /t 5 >nul

echo.
echo Step 2: Starting Web Application...
echo ------------------------------------
cd apps\web
if not exist node_modules (
    echo Installing Web dependencies (this may take 2-3 minutes)...
    call npm install
)
start "Web App - Port 3000" cmd /k "color 0B && cls && echo RUBAN BLEU WEB APPLICATION && echo ========================== && echo. && echo Starting on port 3000... && echo. && npm run dev"

cd ..\..

echo.
echo ============================================================
echo     WAITING FOR SERVICES TO START...
echo ============================================================
echo.
echo Please wait 20-30 seconds for both services to start.
echo.

timeout /t 10 /nobreak >nul

echo Opening API Tester...
start api-tester.html

timeout /t 10 /nobreak >nul

echo.
echo Opening Web Application...
start http://localhost:3000

echo.
echo ============================================================
echo     APPLICATION IS RUNNING!
echo ============================================================
echo.
echo   API Server:       http://localhost:3001
echo   Web Application:  http://localhost:3000
echo   API Tester:       Open api-tester.html
echo.
echo   Demo Credentials:
echo   Email: demo@example.com
echo   Password: demo123
echo.
echo   Two command windows should be open:
echo   - Green window: API Server (Port 3001)
echo   - Blue window: Web Application (Port 3000)
echo.
echo ============================================================
echo.
pause
