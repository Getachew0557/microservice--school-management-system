const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.'
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Service URLs from environment variables
const services = {
  student: {
    url: process.env.STUDENT_SERVICE_URL || 'http://localhost:3001',
    timeout: 10000
  },
  teacher: {
    url: process.env.TEACHER_SERVICE_URL || 'http://localhost:3002',
    timeout: 10000
  },
  course: {
    url: process.env.COURSE_SERVICE_URL || 'http://localhost:3003',
    timeout: 10000
  },
  grade: {
    url: process.env.GRADE_SERVICE_URL || 'http://localhost:3004',
    timeout: 10000
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  const serviceStatus = Object.keys(services).map(service => ({
    name: service,
    url: services[service].url
  }));
  
  res.status(200).json({
    status: 'success',
    message: 'API Gateway is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: serviceStatus
  });
});

// Service status endpoint
app.get('/status', async (req, res) => {
  const axios = require('axios');
  const status = {};
  
  for (const [serviceName, service] of Object.entries(services)) {
    try {
      const response = await axios.get(`${service.url}/health`, { timeout: 5000 });
      status[serviceName] = {
        status: 'up',
        responseTime: response.duration,
        data: response.data
      };
    } catch (error) {
      status[serviceName] = {
        status: 'down',
        error: error.message
      };
    }
  }
  
  res.json({
    gateway: 'up',
    timestamp: new Date().toISOString(),
    services: status
  });
});

// Proxy configuration for each service
const createServiceProxy = (serviceName) => {
  return createProxyMiddleware({
    target: services[serviceName].url,
    changeOrigin: true,
    timeout: services[serviceName].timeout,
    pathRewrite: {
      [`^/api/${serviceName}`]: `/api/${serviceName}`
    },
    onError: (err, req, res) => {
      console.error(`[${serviceName} Service Error]:`, err.message);
      res.status(503).json({
        status: 'error',
        message: `${serviceName} service is temporarily unavailable`,
        service: serviceName,
        timestamp: new Date().toISOString()
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Gateway] ${req.method} ${req.url} → ${proxyReq.path}`);
    }
  });
};

// Set up proxies for each service
app.use('/api/students', createServiceProxy('student'));
app.use('/api/teachers', createServiceProxy('teacher'));
app.use('/api/courses', createServiceProxy('course'));
app.use('/api/grades', createServiceProxy('grade'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.url} not found`,
    availableRoutes: [
      'GET /health',
      'GET /status',
      'GET /api/students',
      'GET /api/teachers',
      'GET /api/courses',
      'GET /api/grades'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Gateway Error]:', err.stack);
  
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 API GATEWAY STARTED');
  console.log('='.repeat(50));
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📚 API Base: http://localhost:${PORT}/api`);
  console.log('📊 Available Services:');
  Object.entries(services).forEach(([name, service]) => {
    console.log(`   • ${name}: ${service.url}`);
  });
  console.log('='.repeat(50));
  console.log('🎯 Frontend should use: http://localhost:3000/api');
  console.log('='.repeat(50));
});

module.exports = app;