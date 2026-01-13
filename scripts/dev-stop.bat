@echo off
echo 🛑 Stopping School Management System...
echo.

docker-compose down

echo.
echo ✅ All services stopped
echo.
echo 💾 Volumes preserved. To remove everything:
echo   docker-compose down -v
echo   docker system prune -f
echo.
pause