#!/bin/bash

# CUREX - Single URL Startup Script

echo "🏥 Starting CUREX Clinical Intake Platform..."
echo "=============================================="
echo ""

# Check if dist folder exists
if [ ! -d "apps/web/dist" ]; then
  echo "📦 Building frontend (first time)..."
  npm run build:web
  echo ""
fi

echo "🚀 Starting CUREX on http://localhost:3000"
echo ""
echo "   Frontend: http://localhost:3000"
echo "   API:      http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop"
echo "=============================================="
echo ""

# Start the server
cd apps/api && NODE_ENV=production npm run dev
