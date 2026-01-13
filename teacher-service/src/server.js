const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection, initializeDatabase } = require('./config/database');
const teacherRoutes = require('./routes/teacherRoutes'); // This imports teacherRouter
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Teacher service is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes - Use the imported teacherRouter
app.use('/api/teachers', teacherRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// Error handling middleware
app.use(errorHandler);

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
      console.log(`✅ Teacher service is running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation:`);
      console.log(`   Health check: GET /health`);
      console.log(`   Get teachers: GET /api/teachers`);
      console.log(`   Create teacher: POST /api/teachers`);
      console.log(`   Get teacher: GET /api/teachers/:id`);
      console.log(`   Update teacher: PUT /api/teachers/:id`);
      console.log(`   Delete teacher: DELETE /api/teachers/:id`);
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

module.exports = app;