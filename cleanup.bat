@echo off
cls
echo ============================================================
echo     CLEANING UP UNUSED FILES
echo ============================================================
echo.

cd /d C:\Users\blain\Desktop\Planning-Suite

echo Removing old batch files...
del complete-setup.bat 2>nul
del fix-database.bat 2>nul
del FIX-PORT.bat 2>nul
del install-deps.bat 2>nul
del QUICK_START.bat 2>nul
del run-api.bat 2>nul
del RUN-NOW.bat 2>nul
del run-without-database.bat 2>nul
del SKIP-DATABASE.bat 2>nul
del start.bat 2>nul
del start.ps1 2>nul
del TEST-SERVER.bat 2>nul
del test-setup.bat 2>nul
del use-sqlite.bat 2>nul
del EMERGENCY-FIX.bat 2>nul
del RUN-ALL.bat 2>nul
del RUN-ALL-FIXED.bat 2>nul
del START-EVERYTHING.bat 2>nul
del TEST-API.bat 2>nul

echo.
echo Removing test files...
del test-api.html 2>nul
del HOW_TO_RUN.md 2>nul

echo.
echo Removing duplicate API files...
cd apps\api
del simple-server.js 2>nul
del no-database-server.js 2>nul
del test-server.js 2>nul
del simple-package.json 2>nul
cd ..\..

echo.
echo Removing SQLite files...
cd packages\database\prisma
del schema-sqlite.prisma 2>nul
del schema-backup.prisma 2>nul
del complete-schema.prisma 2>nul
del dev.db 2>nul
cd ..\..\..

echo.
echo Cleaning node_modules (optional - press N to keep)...
set /p clean="Remove node_modules folders? (Y/N): "
if /i "%clean%"=="Y" (
    echo Removing node_modules...
    if exist node_modules rmdir /s /q node_modules
    if exist apps\api\node_modules rmdir /s /q apps\api\node_modules
    if exist apps\web\node_modules rmdir /s /q apps\web\node_modules
    if exist packages\database\node_modules rmdir /s /q packages\database\node_modules
)

echo.
echo ============================================================
echo     CLEANUP COMPLETE!
echo ============================================================
echo.
echo Remaining files:
echo   - docker-run.bat (Run everything with Docker)
echo   - docker-compose.yml (Docker configuration)
echo   - Source code in apps/ and packages/
echo.
pause
