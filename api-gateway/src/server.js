const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Service URLs
const services = {
  student: process.env.STUDENT_SERVICE_URL || "http://localhost:3001",
  teacher: process.env.TEACHER_SERVICE_URL || "http://localhost:3002",
  course: process.env.COURSE_SERVICE_URL || "http://localhost:3003",
  grade: process.env.GRADE_SERVICE_URL || "http://localhost:3004",
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API Gateway is running",
    services: Object.keys(services),
    timestamp: new Date().toISOString(),
  });
});

// Proxy middleware for each service
app.use(
  "/api/students",
  createProxyMiddleware({
    target: services.student,
    changeOrigin: true,
    pathRewrite: {
      "^/api/students": "/api/students",
    },
    onError: (err, req, res) => {
      console.error("Student Service Error:", err.message);
      res.status(503).json({
        status: "error",
        message: "Student service is unavailable",
      });
    },
  })
);

app.use(
  "/api/teachers",
  createProxyMiddleware({
    target: services.teacher,
    changeOrigin: true,
    pathRewrite: {
      "^/api/teachers": "/api/teachers",
    },
    onError: (err, req, res) => {
      console.error("Teacher Service Error:", err.message);
      res.status(503).json({
        status: "error",
        message: "Teacher service is unavailable",
      });
    },
  })
);

app.use(
  "/api/courses",
  createProxyMiddleware({
    target: services.course,
    changeOrigin: true,
    pathRewrite: {
      "^/api/courses": "/api/courses",
    },
    onError: (err, req, res) => {
      console.error("Course Service Error:", err.message);
      res.status(503).json({
        status: "error",
        message: "Course service is unavailable",
      });
    },
  })
);

app.use(
  "/api/grades",
  createProxyMiddleware({
    target: services.grade,
    changeOrigin: true,
    pathRewrite: {
      "^/api/grades": "/api/grades",
    },
    onError: (err, req, res) => {
      console.error("Grade Service Error:", err.message);
      res.status(503).json({
        status: "error",
        message: "Grade service is unavailable",
      });
    },
  })
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Gateway Error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
  console.log("📡 Proxying requests to:");
  console.log(`   Students: ${services.student}`);
  console.log(`   Teachers: ${services.teacher}`);
  console.log(`   Courses: ${services.course}`);
  console.log(`   Grades: ${services.grade}`);
});
