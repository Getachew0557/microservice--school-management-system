const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection, initializeDatabase } = require('./config/database');
const studentRoutes = require('./routes/studentRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Student service is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/students', studentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// Error handling middleware
app.use(errorHandler);

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  // Start server
  async function startServer() {
    try {
      // Test database connection
      const dbConnected = await testConnection();
      if (!dbConnected) {
        console.error('❌ Cannot start server without database connection');
        process.exit(1);
      }

      // Initialize database tables
      await initializeDatabase();

      // Start listening
      app.listen(PORT, () => {
        console.log(`✅ Server is running on http://localhost:${PORT}`);
        console.log(`📚 API Documentation:`);
        console.log(`   Health check: GET /health`);
        console.log(`   Get students: GET /api/students`);
        console.log(`   Create student: POST /api/students`);
        console.log(`   Get student: GET /api/students/:id`);
        console.log(`   Update student: PUT /api/students/:id`);
        console.log(`   Delete student: DELETE /api/students/:id`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  });

  // Start the server
  startServer();
}

module.exports = app; // For testing