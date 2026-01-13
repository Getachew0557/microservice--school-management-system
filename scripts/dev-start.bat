@echo off
echo ========================================
echo  🚀 School Management System - Docker   
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running!
    echo Please start Docker Desktop from Start Menu
    pause
    exit /b 1
)

echo 📦 Stopping any existing containers...
docker-compose down

echo.
echo 🏗️  Building Docker images...
docker-compose build

echo.
echo 🚀 Starting all services...
docker-compose up -d

echo.
echo ⏳ Waiting for services to initialize...
timeout /t 10 /nobreak >nul

echo.
echo 📊 Checking service status...
echo.

echo MySQL Databases:
docker ps --filter "name=mysql" --format "table {{.Names}}\t{{.Status}}"

echo.
echo Microservices:
docker ps --filter "name=-service" --format "table {{.Names}}\t{{.Status}}"

echo.
echo Frontend & Tools:
docker ps --filter "name=frontend" --filter "name=adminer" --format "table {{.Names}}\t{{.Status}}"

echo.
echo ========================================
echo 🌐 ACCESS URLS:
echo ========================================
echo Frontend:      http://localhost:5173
echo API Gateway:   http://localhost:3000
echo Student API:   http://localhost:3001
echo Teacher API:   http://localhost:3002
echo.
echo Database Admin: http://localhost:8080
echo   - System: MySQL
echo   - Server: mysql-student (or mysql-teacher)
echo   - Username: root
echo   - Password: rootpassword
echo.
echo ========================================
echo 📝 Useful Commands:
echo   stop-dev.bat           - Stop all services
echo   view-logs.bat          - View all logs
echo   view-logs.bat student  - View student service logs
echo   docker-compose ps      - Check container status
echo   docker-compose exec student-service sh - Enter container shell
echo ========================================
echo.
echo ✅ Development environment is ready!
echo Press any key to exit...
pause >nul