@echo off
echo Stopping existing backend on port 1788...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :1788 ^| findstr LISTENING') do (
    echo Killing process %%a
    taskkill /PID %%a /F >nul 2>&1
)

timeout /t 2 /nobreak >nul

echo Starting backend server...
cd /d "%~dp0"
start "Backend Server" cmd /k "uvicorn app_manufacturing:app --host 0.0.0.0 --port 1788 --reload"

timeout /t 3 /nobreak >nul

echo.
echo Backend should now be running on http://localhost:1788
echo.
echo Test it by opening: http://localhost:1788/health
echo.
pause

