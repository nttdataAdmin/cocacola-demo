@echo off
echo Starting Pepsico Manufacturing Production Line Management System
echo.
echo Backend will run on http://155.17.172.33:1788 (or http://localhost:1788)
echo Frontend will run on http://localhost:1789
echo.
echo Make sure you have:
echo 1. Python dependencies installed (pip install -r requirements.txt)
echo 2. Azure OpenAI credentials in .env file
echo 3. Tesseract installed for OCR (optional - will use simulation if not available)
echo.
pause
echo Starting backend server...
start cmd /k "uvicorn app_manufacturing:app --host 0.0.0.0 --port 1788"
timeout /t 3
echo.
echo Backend started! Starting frontend...
echo.
echo To use manufacturing app, update frontend/index.html to use mainManufacturing.jsx
echo Or run: cd frontend && npm run dev
pause

