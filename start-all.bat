@echo off
echo Starting School Management System Microservices...
echo.

REM Start API Gateway
start "API Gateway" cmd /k "cd api-gateway && npm run dev"
timeout /t 3 /nobreak >nul

REM Start Student Service
start "Student Service" cmd /k "cd student-service && npm run dev"
timeout /t 2 /nobreak >nul

REM Start Teacher Service
start "Teacher Service" cmd /k "cd teacher-service && npm run dev"
timeout /t 2 /nobreak >nul

REM Start Frontend
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ✅ All services starting...
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🚀 API Gateway: http://localhost:3000
echo 🎓 Student Service: http://localhost:3001
echo 👨‍🏫 Teacher Service: http://localhost:3002
echo.
echo Press any key to stop all services...
pause >nul

REM Kill all Node processes
taskkill /F /IM node.exe >nul 2>&1
echo.
echo All services stopped.