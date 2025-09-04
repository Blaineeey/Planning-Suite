@echo off
cls
echo ============================================================
echo     RUBAN BLEU - DOCKER SETUP
echo ============================================================
echo.

echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed!
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo Docker is installed!
echo.

echo Checking if Docker Desktop is running...
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Desktop is not running!
    echo.
    echo Please start Docker Desktop and wait for it to fully load.
    echo Then run this script again.
    echo.
    echo Attempting to start Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo.
    echo Wait for Docker Desktop to start (about 30-60 seconds)
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

echo Docker is running!
echo.
echo ============================================================
echo     BUILDING AND STARTING ALL SERVICES
echo ============================================================
echo.

echo Step 1: Stopping any existing containers...
docker-compose down 2>nul

echo.
echo Step 2: Building containers...
echo This may take 2-5 minutes on first run...
docker-compose build --no-cache

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo Check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo Step 3: Starting all services...
docker-compose up -d

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start services!
    echo.
    pause
    exit /b 1
)

echo.
echo Step 4: Waiting for services to be ready (30 seconds)...
timeout /t 30 /nobreak

echo.
echo Step 5: Checking service status...
echo.
docker-compose ps

echo.
echo ============================================================
echo     ALL SERVICES SHOULD BE RUNNING!
echo ============================================================
echo.
echo   Web Application:  http://localhost:3000
echo   API Server:       http://localhost:3001
echo   API Health:       http://localhost:3001/health
echo   Database GUI:     http://localhost:5555
echo.
echo ============================================================
echo.
echo Opening browser to test...
start http://localhost:3001/health
timeout /t 2 >nul
start http://localhost:3000

echo.
echo ============================================================
echo     USEFUL COMMANDS:
echo ============================================================
echo.
echo   View logs:         docker-compose logs -f
echo   Stop all:          docker-compose down
echo   Restart:           docker-compose restart
echo   Check status:      docker-compose ps
echo.
echo ============================================================
echo.
echo Press any key to view logs (or close this window)...
pause >nul

echo.
echo Showing logs (Press Ctrl+C to stop)...
docker-compose logs -f
