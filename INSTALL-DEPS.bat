@echo off
echo ============================================
echo    INSTALLING DEPENDENCIES
echo ============================================
echo.

echo Installing API dependencies...
cd apps\api
call npm install

echo.
echo Installing Web dependencies...
cd ..\web
call npm install

echo.
echo ============================================
echo    DEPENDENCIES INSTALLED
echo ============================================
echo.
echo You can now start the servers with:
echo   START-SERVERS.bat
echo   or
echo   node start-dev.js
echo.
pause
