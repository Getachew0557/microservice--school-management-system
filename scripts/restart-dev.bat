@echo off
echo 🔄 Restarting School Management System...
echo.

call stop-dev.bat >nul 2>&1
timeout /t 3 /nobreak >nul
call start-dev.bat