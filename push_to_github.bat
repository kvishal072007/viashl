@echo off
echo ============================================================
echo Pushing EnviroTrack Infra to GitHub: kvishal072007/viashl
echo ============================================================
echo.
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%LOCALAPPDATA%\Programs\Git Credential Manager;%PATH%"
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Project successfully pushed to https://github.com/kvishal072007/viashl
) else (
    echo [NOTE] If prompted, sign in via browser or enter your GitHub Personal Access Token.
)
pause
