#!/bin/bash

echo "Starting School Management System Microservices..."
echo ""

# Start API Gateway
cd api-gateway && npm run dev &
sleep 3

# Start Student Service
cd student-service && npm run dev &
sleep 2

# Start Teacher Service
cd teacher-service && npm run dev &
sleep 2

# Start Frontend
cd frontend && npm run dev &
sleep 2

echo ""
echo "✅ All services starting..."
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🚀 API Gateway: http://localhost:3000"
echo "🎓 Student Service: http://localhost:3001"
echo "👨‍🏫 Teacher Service: http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop all services..."
echo ""

# Wait for Ctrl+C
trap 'kill $(jobs -p)' EXIT
wait