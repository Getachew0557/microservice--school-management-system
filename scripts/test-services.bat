@echo off
echo 🧪 Testing Microservices...
echo.

echo 🔗 Testing API endpoints...
echo.

echo 1. Student Service Health:
curl -s -o nul -w "%%{http_code}" http://localhost:3001/health
if errorlevel 1 (echo ❌ Failed) else (echo ✅ OK)

echo.
echo 2. Teacher Service Health:
curl -s -o nul -w "%%{http_code}" http://localhost:3002/health
if errorlevel 1 (echo ❌ Failed) else (echo ✅ OK)

echo.
echo 3. API Gateway Health:
curl -s -o nul -w "%%{http_code}" http://localhost:3000/health
if errorlevel 1 (echo ❌ Failed) else (echo ✅ OK)

echo.
echo 4. Student Data:
curl -s http://localhost:3000/api/students | findstr "data"
if errorlevel 1 (echo ❌ No data found) else (echo ✅ Data available)

echo.
echo 5. Teacher Data:
curl -s http://localhost:3000/api/teachers | findstr "data"
if errorlevel 1 (echo ❌ No data found) else (echo ✅ Data available)

echo.
echo 📊 Container Status:
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

echo.
pause