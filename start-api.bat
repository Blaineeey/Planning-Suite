@echo off
cls
echo ============================================================
echo     STARTING RUBAN BLEU API SERVER
echo ============================================================
echo.

cd C:\Users\blain\Desktop\Planning-Suite\apps\api

echo Installing dependencies...
call npm install

echo.
echo ============================================================
echo     API SERVER STARTING...
echo ============================================================
echo.
echo The API will run with an in-memory database.
echo No external database setup required!
echo.
echo Demo Login:
echo   Email: demo@example.com
echo   Password: demo123
echo.
echo ============================================================
echo.

node server.js

pause
