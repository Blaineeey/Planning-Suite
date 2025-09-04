@echo off
title Ruban Bleu Docker
color 0A
cls
echo ============================================================
echo     RUBAN BLEU - SIMPLE DOCKER START
echo ============================================================
echo.

cd /d C:\Users\blain\Desktop\Planning-Suite

echo Checking Docker...
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop first!
    pause
    exit
)

echo Docker is running!
echo.
echo Starting services...
echo.

docker-compose down >nul 2>&1
docker-compose up -d --build

echo.
echo Waiting 20 seconds for services to start...
timeout /t 20

echo.
echo ============================================================
echo     SERVICES STATUS:
echo ============================================================
docker-compose ps

echo.
echo ============================================================
echo     ACCESS POINTS:
echo ============================================================
echo.
echo   Web App:  http://localhost:3000
echo   API:      http://localhost:3001
echo   Health:   http://localhost:3001/health
echo.
echo ============================================================
echo.
echo Opening browser...
start http://localhost:3000
start http://localhost:3001/health

echo.
echo ============================================================
echo     KEEP THIS WINDOW OPEN!
echo ============================================================
echo.
echo To stop Docker services, press Ctrl+C then run:
echo   docker-compose down
echo.
echo To view logs, open a new cmd and run:
echo   docker-compose logs -f
echo.
echo ============================================================
echo.
echo Press any key to show live logs...
pause >nul

docker-compose logs -f

pause
