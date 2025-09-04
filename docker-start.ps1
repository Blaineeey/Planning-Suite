# Ruban Bleu Docker Setup Script
Clear-Host
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     RUBAN BLEU - DOCKER SETUP (PowerShell)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# Check Docker installation
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
if (-not (Test-CommandExists "docker")) {
    Write-Host "ERROR: Docker is not installed!" -ForegroundColor Red
    Write-Host "Please download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Docker is installed" -ForegroundColor Green

# Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
$dockerRunning = $false
try {
    docker version | Out-Null
    $dockerRunning = $true
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "Docker Desktop is not running!" -ForegroundColor Yellow
    Write-Host "Starting Docker Desktop..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    
    Write-Host "Waiting for Docker to start (60 seconds)..." -ForegroundColor Yellow
    for ($i = 1; $i -le 60; $i++) {
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 1
        try {
            docker version | Out-Null
            $dockerRunning = $true
            break
        } catch {
            continue
        }
    }
    Write-Host ""
}

if (-not $dockerRunning) {
    Write-Host "ERROR: Docker failed to start!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop manually." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Navigate to project
Set-Location "C:\Users\blain\Desktop\Planning-Suite"

# Stop existing containers
Write-Host ""
Write-Host "Cleaning up existing containers..." -ForegroundColor Yellow
docker-compose down --remove-orphans 2>$null | Out-Null

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     BUILDING AND STARTING SERVICES" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Build and start services
Write-Host "Starting services with docker-compose..." -ForegroundColor Green
docker-compose up -d --build

# Wait for services
Write-Host ""
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check status
Write-Host ""
Write-Host "Service Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "     SERVICES ARE RUNNING!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access points:" -ForegroundColor Cyan
Write-Host "  Web App:  " -NoNewline; Write-Host "http://localhost:3000" -ForegroundColor White
Write-Host "  API:      " -NoNewline; Write-Host "http://localhost:3001" -ForegroundColor White
Write-Host "  Health:   " -NoNewline; Write-Host "http://localhost:3001/health" -ForegroundColor White
Write-Host ""

# Open browser
Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:3001/health"
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     USEFUL COMMANDS" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "View logs:    docker-compose logs -f" -ForegroundColor White
Write-Host "Stop all:     docker-compose down" -ForegroundColor White
Write-Host "Restart:      docker-compose restart" -ForegroundColor White
Write-Host "Status:       docker-compose ps" -ForegroundColor White
Write-Host ""

Write-Host "Press Enter to view logs, or Ctrl+C to exit..." -ForegroundColor Gray
Read-Host

# Show logs
docker-compose logs -f
