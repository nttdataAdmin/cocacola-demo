#!/bin/bash

echo "Starting Pepsico Manufacturing Production Line Management System"
echo ""
echo "Backend will run on http://155.17.172.33:1788 (or http://localhost:1788)"
echo "Frontend will run on http://localhost:1789"
echo ""
echo "Make sure you have:"
echo "1. Python dependencies installed (pip install -r requirements.txt)"
echo "2. Azure OpenAI credentials in .env file"
echo "3. Tesseract installed for OCR (optional - will use simulation if not available)"
echo ""

read -p "Press enter to start backend server..."

# Start backend in background
uvicorn app_manufacturing:app --host 0.0.0.0 --port 1788 &
BACKEND_PID=$!

echo "Backend started (PID: $BACKEND_PID)"
echo ""
echo "To use manufacturing app:"
echo "1. Update frontend/index.html to use mainManufacturing.jsx"
echo "2. Or create a separate HTML file for manufacturing app"
echo "3. Run: cd frontend && npm run dev"
echo ""
echo "Press Ctrl+C to stop backend server"

# Wait for user interrupt
wait $BACKEND_PID

