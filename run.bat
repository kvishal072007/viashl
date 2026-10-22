@echo off
title EnviroTrack Infra System
cls
echo =======================================================
echo   EnviroTrack Infra - Government Compliance System
echo =======================================================
echo.
echo [1/3] Starting Backend Server on http://localhost:5000 ...
start "Backend Server (Port 5000)" cmd /k "cd /d "%~dp0server" && node dist/server.js"

echo [2/3] Starting Frontend Website on http://localhost:3000 ...
start "Frontend Website (Port 3000)" cmd /k "cd /d "%~dp0client" && npx vite preview --port 3000 --host"

echo [3/3] Opening Browser at http://localhost:3000 ...
timeout /t 3 >nul
start http://localhost:3000

echo.
echo =======================================================
echo   System running successfully!
echo   Login Email:    kvishal072007@gmail.com
echo   Login Password: Revathi85
echo =======================================================
