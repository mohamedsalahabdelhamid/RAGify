@echo off
echo ========================================
echo    RAGify - Starting Local Demo Server
echo ========================================
echo.
echo [1/2] Starting FastAPI Backend on port 9999...
echo Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":9999" ^| find "LISTENING"') do taskkill /f /pid %%a 2>nul
start cmd /k "cd backend && python -m uvicorn main:app --reload --port 9999"

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak

echo [2/2] Starting Serveo SSH Tunnel (Ultra Stable & Unblocked)...
echo.
echo ========================================
echo IMPORTANT: When the black screen opens, look for a link that starts with:
echo    "https://" and ends with ".serveousercontent.com"
echo Copy that link and paste it into the Dashboard Settings.
echo ========================================
echo.
start cmd /k "ssh -o StrictHostKeyChecking=no -R 80:localhost:9999 serveo.net"

echo.
echo ========================================
echo  Frontend: https://ragify.vercel.app
echo ========================================
echo Share the Vercel link with anyone!
pause
