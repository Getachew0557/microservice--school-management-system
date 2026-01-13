@echo off
echo Testing CI/CD Pipeline Locally...
echo.

echo 1. Running linting checks...
cd student-service
call npm run lint || echo "Linting failed for student-service"
cd ../teacher-service
call npm run lint || echo "Linting failed for teacher-service"
cd ../api-gateway  
call npm run lint || echo "Linting failed for api-gateway"
cd ../frontend
call npm run lint || echo "Linting failed for frontend"
cd ..

echo.
echo 2. Running tests...
cd student-service
call npm test || echo "Tests failed for student-service"
cd ../teacher-service
call npm test || echo "Tests failed for teacher-service"
cd ../api-gateway
call npm test -- --passWithNoTests || echo "Tests failed for api-gateway"
cd ../frontend
cd ../frontend
if exist node_modules\.bin\jest (
	call npm test -- --passWithNoTests || echo "Tests failed for frontend"
) else (
	echo Skipping frontend tests: jest not installed in frontend/node_modules
)
cd ..

echo.
echo 3. Building Docker images...
call docker-compose build --no-cache

echo.
echo 4. Running integration tests...
if exist docker-compose.test.yml (
	call docker-compose -f docker-compose.test.yml up -d
	timeout /t 30 /nobreak >nul

	echo Testing API endpoints...
	curl http://localhost:3001/health
	curl http://localhost:3002/health
	curl http://localhost:3000/health

	echo.
	echo 5. Cleaning up...
	call docker-compose -f docker-compose.test.yml down
) else (
	echo Skipping integration tests: docker-compose.test.yml not found
)

echo.
echo ✅ CI/CD local test completed!
pause