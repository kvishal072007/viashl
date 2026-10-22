@echo off
title EnviroTrack Backend (Port 5000)
cd /d "%~dp0server"
node dist/server.js
pause
