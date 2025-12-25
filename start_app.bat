@echo off
echo Starting Xandeum Analytics...

:: Start Backend (Port 8001)
start "Xandeum Backend" cmd /k "cd backend && call venv\Scripts\activate && uvicorn main:app --reload --port 8001"

:: Start Frontend
start "Xandeum Frontend" cmd /k "npm run dev"

echo Application launching...
echo Backend: http://localhost:8001
echo Frontend: http://localhost:5173
pause
