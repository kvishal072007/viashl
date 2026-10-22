@echo off
title EnviroTrack Frontend (Port 3000)
cd /d "%~dp0client"
npx vite preview --port 3000 --host
pause
