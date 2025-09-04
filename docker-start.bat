@echo off
setlocal enabledelayedexpansion
cls
echo ============================================================
echo     RUBAN BLEU - DOCKER COMPLETE SETUP
echo ============================================================
echo.

:: Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed!
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo [OK] Docker is installed
echo.

:: Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Desktop is not running!
    echo.
    echo Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo.
    echo Waiting 45 seconds for Docker to start...
    for /l %%i in (1,1,45) do (
        echo|set /p="."
        timeout /t 1 /nobreak >nul
    )
    echo.
    echo.
    
    :: Check again
    docker version >nul 2>&1
    if !errorlevel! neq 0 (
        echo ERROR: Docker Desktop failed to start!
        echo Please start Docker Desktop manually and run this script again.
        pause
        exit /b 1
    )
)

echo [OK] Docker is running
echo.

:: Navigate to project directory
cd /d C:\Users\blain\Desktop\Planning-Suite

:: Stop existing containers
echo Cleaning up old containers...
docker-compose down --remove-orphans >nul 2>&1
docker system prune -f >nul 2>&1

echo.
echo ============================================================
echo     STARTING SERVICES WITH DOCKER-COMPOSE
echo ============================================================
echo.

:: Start services in detached mode
echo Starting PostgreSQL database...
docker-compose up -d postgres
timeout /t 5 /nobreak >nul

echo Starting Redis cache...
docker-compose up -d redis
timeout /t 3 /nobreak >nul

echo Starting API server...
docker-compose up -d api
timeout /t 10 /nobreak >nul

echo Starting Web application...
docker-compose up -d web
timeout /t 10 /nobreak >nul

echo.
echo ============================================================
echo     CHECKING SERVICE STATUS
echo ============================================================
echo.

docker-compose ps

echo.
echo ============================================================
echo     SERVICES ARE STARTING...
echo ============================================================
echo.
echo It may take 1-2 minutes for everything to be ready.
echo.
echo Access points:
echo   Web App:  http://localhost:3000
echo   API:      http://localhost:3001
echo   Database: localhost:5432 (user: postgres, pass: postgres)
echo   Redis:    localhost:6379
echo.
echo ============================================================
echo.

:: Open browser after delay
echo Opening browser in 10 seconds...
timeout /t 10 /nobreak >nul
start http://localhost:3001/health
start http://localhost:3000

echo.
echo ============================================================
echo     DOCKER COMMANDS
echo ============================================================
echo.
echo View logs:        docker-compose logs -f
echo Stop all:         docker-compose down
echo Restart:          docker-compose restart
echo Service status:   docker-compose ps
echo.
echo This window will stay open. Press any key to see live logs...
echo ============================================================
echo.
pause

:: Show logs
docker-compose logs -f
