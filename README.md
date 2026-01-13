# School Management System

A microservices-based school management system built with:
- React + Vite (Frontend)
- Node.js + Express (Backend)
- MySQL (Database)
- Material UI (UI Components)
- Docker (Containerization)
- GitHub Actions (CI/CD)

## Project Structure
```bash
school-management-system/
├── frontend/
├── api-gateway/
├── student-service/
│   ├── Dockerfile.dev
│   ├── src/
│   └── sql/
├── teacher-service/
├── docker-compose.yml
├── docker-compose.monitoring.yml
├── monitoring/
│   ├── prometheus/
│   ├── grafana/
│   └── promtail/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── docker-build.yml
│       └── deploy-dev.yml
├── scripts/
├── Makefile
└── README.md
```

## 🚀 How to Run:
### windows
- Navigate to school-management-system/
- Double-click start-all.bat

## 🛑 To Stop All Services:
- Press any key in the start-all.bat window
- Or manually close each terminal window
- Or run in new terminal: