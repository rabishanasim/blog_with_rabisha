@echo off
echo Starting Personal Blog Platform...
echo.

echo Starting Backend Server...
start "Backend Server" /D "C:\Users\shahr\OneDrive\Desktop\Personal-Blog-Platform\backend" cmd /k "node server.js"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" /D "C:\Users\shahr\OneDrive\Desktop\Personal-Blog-Platform\frontend" cmd /k "npm run dev"

echo.
echo Servers are starting...
echo Frontend will be available at: http://localhost:3000
echo Backend API available at: http://localhost:5000
echo.
echo Press any key to exit...
pause >nul