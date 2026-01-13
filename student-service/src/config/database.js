const mysql = require('mysql2/promise');
require('dotenv').config();

// Use test database for test environment
const dbConfig = {
  host:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DB_HOST
      : process.env.DB_HOST,
  port:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DB_PORT
      : process.env.DB_PORT,
  user:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DB_USER
      : process.env.DB_USER,
  password:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DB_PASSWORD
      : process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DB_NAME
      : process.env.DB_NAME || 'school_management',
  waitForConnections: true,
  connectionLimit: process.env.DB_POOL_LIMIT || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

console.log(`Connecting to database: ${dbConfig.database}`);

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Database connected successfully to ${dbConfig.database}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Initialize database tables
async function initializeDatabase() {
  // Don't initialize in test environment - tests handle their own setup
  if (process.env.NODE_ENV === 'test') {
    console.log('⏭️ Skipping database initialization in test environment');
    return;
  }

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS students (
      id INT PRIMARY KEY AUTO_INCREMENT,
      student_id VARCHAR(20) UNIQUE NOT NULL,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(20),
      date_of_birth DATE,
      address TEXT,
      enrollment_date DATE DEFAULT (CURRENT_DATE),
      status ENUM('active', 'inactive', 'graduated') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Students table initialized');

    // Add sample data if table is empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM students');
    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth, address) VALUES
        ('ST001', 'John', 'Doe', 'john@example.com', '1234567890', '2000-01-15', '123 Main St'),
        ('ST002', 'Jane', 'Smith', 'jane@example.com', '0987654321', '2001-03-22', '456 Oak Ave'),
        ('ST003', 'Bob', 'Johnson', 'bob@example.com', '5551234567', '1999-11-30', '789 Pine Rd');
      `);
      console.log('✅ Sample data inserted');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
};
