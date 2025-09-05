@echo off
cls
echo ============================================================
echo     RUBAN BLEU - TROUBLESHOOTING HELPER
echo ============================================================
echo.

echo Checking system requirements...
echo.

echo [1] Node.js Version:
node --version 2>nul
if errorlevel 1 (
    echo    ERROR: Node.js not found!
    echo    Please install from: https://nodejs.org
    set NODE_OK=0
) else (
    echo    OK - Node.js is installed
    set NODE_OK=1
)
echo.

echo [2] Docker Version:
docker --version 2>nul
if errorlevel 1 (
    echo    WARNING: Docker not found
    echo    Docker is optional but recommended
    set DOCKER_OK=0
) else (
    echo    OK - Docker is installed
    set DOCKER_OK=1
)
echo.

echo [3] Docker Service:
docker ps >nul 2>&1
if errorlevel 1 (
    echo    WARNING: Docker daemon not running
    echo    Start Docker Desktop if you want to use Docker
) else (
    echo    OK - Docker daemon is running
)
echo.

echo [4] Port Availability:
netstat -an | find "3000" >nul 2>&1
if not errorlevel 1 (
    echo    WARNING: Port 3000 may be in use
) else (
    echo    OK - Port 3000 is available
)

netstat -an | find "3001" >nul 2>&1
if not errorlevel 1 (
    echo    WARNING: Port 3001 may be in use
) else (
    echo    OK - Port 3001 is available
)
echo.

echo [5] Testing API connectivity:
curl -s http://localhost:3001/health >nul 2>&1
if errorlevel 1 (
    echo    API is not running (this is normal if not started yet)
) else (
    echo    OK - API is responding
)
echo.

echo ============================================================
echo     RECOMMENDATIONS
echo ============================================================
echo.

if "%DOCKER_OK%"=="1" (
    echo 1. You have Docker - use START.bat for best experience
) else (
    if "%NODE_OK%"=="1" (
        echo 1. You have Node.js - use START-SIMPLE.bat instead
    ) else (
        echo 1. Install Node.js first from https://nodejs.org
    )
)

echo.
echo 2. If ports are in use, stop other applications using them
echo    or modify the port numbers in the configuration files
echo.
echo 3. For Docker issues:
echo    - Make sure Docker Desktop is running
echo    - Try: docker-compose down
echo    - Then: docker-compose build --no-cache
echo    - Then: docker-compose up
echo.
echo 4. For non-Docker setup:
echo    - Use START-SIMPLE.bat
echo    - Or manually run:
echo      cd apps\api && npm install && node server.js
echo      cd apps\web && npm install && npm run dev
echo.
echo ============================================================
echo.
pause
