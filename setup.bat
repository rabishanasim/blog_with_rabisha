@echo off
echo 🚀 Setting up Personal Blog Platform...

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is required but not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd backend
call npm install

echo 🔧 Setting up backend environment...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file from template. Please review and update if needed.
)

echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install

echo 🔧 Setting up frontend environment...
if not exist .env (
    copy .env.example .env
    echo ✅ Created frontend .env file from template.
)

cd ..

echo.
echo 🎉 Setup complete!
echo.
echo 🚀 To start the application:
echo.
echo 1. Start the backend (in one terminal):
echo    cd backend ^&^& npm run dev
echo.
echo 2. Start the frontend (in another terminal):
echo    cd frontend ^&^& npm run dev
echo.
echo 3. Open your browser to:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000/api
echo.
echo 📚 Check SETUP_INSTRUCTIONS.md for detailed setup and usage instructions.
echo.
echo Happy blogging! ✨
pause