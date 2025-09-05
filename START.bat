@echo off
cls
echo ============================================================
echo     RUBAN BLEU PLANNING SUITE - DOCKER STARTUP
echo ============================================================
echo.

cd /d "C:\Users\blain\Desktop\Planning-Suite"

echo [1/5] Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Docker is not installed or not running!
    echo.
    echo Please ensure:
    echo   1. Docker Desktop is installed
    echo   2. Docker Desktop is running
    echo   3. Docker is in your system PATH
    echo.
    echo Download from: https://docker.com
    echo.
    pause
    exit /b 1
)

echo [OK] Docker found: 
docker --version
echo.

echo [2/5] Checking Docker service status...
docker ps >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Docker daemon is not running!
    echo.
    echo Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)
echo [OK] Docker daemon is running
echo.

echo [3/5] Cleaning up old containers...
docker-compose down >nul 2>&1
docker-compose rm -f >nul 2>&1
echo [OK] Cleanup completed
echo.

echo [4/5] Building and starting services...
echo This may take 2-5 minutes on first run...
echo.

docker-compose build
if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

docker-compose up -d
if errorlevel 1 (
    echo.
    echo ERROR: Failed to start services!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo [5/5] Waiting for services to be ready (30 seconds)...
echo.

timeout /t 30 /nobreak >nul

echo.
echo ============================================================
echo     SERVICE STATUS CHECK
echo ============================================================
docker-compose ps
echo.

echo ============================================================
echo     TESTING API CONNECTION
echo ============================================================
curl -s http://localhost:3001/health >nul 2>&1
if errorlevel 1 (
    echo [WARNING] API may not be fully ready yet
    echo Please wait a few more seconds and refresh the page
) else (
    echo [OK] API is responding
)
echo.

echo ============================================================
echo     SERVICES ARE RUNNING AT:
echo ============================================================
echo.
echo   Web Application:  http://localhost:3000
echo   API Server:       http://localhost:3001
echo   API Health:       http://localhost:3001/health
echo   PostgreSQL:       localhost:5432
echo   Redis:            localhost:6379
echo.
echo   Demo Credentials:
echo   Email: demo@example.com
echo   Password: demo123
echo.
echo ============================================================
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul

start http://localhost:3001/health
timeout /t 1 /nobreak >nul
start http://localhost:3000

echo.
echo ============================================================
echo     USEFUL COMMANDS:
echo ============================================================
echo.
echo   View logs:        docker-compose logs -f
echo   Stop all:         docker-compose down
echo   Restart:          docker-compose restart
echo   Rebuild:          docker-compose build --no-cache
echo   View API logs:    docker-compose logs -f api
echo   View Web logs:    docker-compose logs -f web
echo.
echo ============================================================
echo.
echo Press any key to exit (services will continue running)...
pause >nul
