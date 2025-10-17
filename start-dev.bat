@echo off
echo Starting Personal Blog Platform...

echo.
echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

timeout /t 3

echo.
echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo Servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Press any key to close this window...
pause >nul