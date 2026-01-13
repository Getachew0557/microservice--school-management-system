@echo off
echo 📋 Viewing Docker Logs
echo.

if "%1"=="" (
    echo Viewing all service logs...
    echo Press Ctrl+C to exit
    echo ========================================
    docker-compose logs -f
) else (
    echo Viewing logs for %1...
    echo Press Ctrl+C to exit
    echo ========================================
    docker-compose logs -f %1
)