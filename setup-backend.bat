@echo off
echo ============================================
echo Setting up Wedding Planning Suite Backend
echo ============================================
echo.

cd apps\api

echo Installing dependencies...
call npm install

echo.
echo Generating Prisma client...
call npx prisma generate

echo.
echo Creating database and running migrations...
call npx prisma migrate dev --name init

echo.
echo Seeding database with demo data...
call npm run seed

echo.
echo ============================================
echo Setup complete! 
echo.
echo Demo credentials:
echo Email: demo@example.com
echo Password: demo123
echo.
echo To start the backend: npm start
echo ============================================
pause
