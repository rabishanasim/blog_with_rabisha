#!/bin/bash

# Personal Blog Platform Setup Script
echo "🚀 Setting up Personal Blog Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB doesn't appear to be running. Please start MongoDB first."
    echo "   You can start it with: brew services start mongodb (on macOS)"
    echo "   Or: sudo systemctl start mongod (on Linux)"
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🔧 Setting up backend environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template. Please review and update if needed."
fi

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🔧 Setting up frontend environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created frontend .env file from template."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open your browser to:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api"
echo ""
echo "📚 Check SETUP_INSTRUCTIONS.md for detailed setup and usage instructions."
echo ""
echo "Happy blogging! ✨"