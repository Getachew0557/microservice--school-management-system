const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'teacher_db',
  waitForConnections: true,
  connectionLimit: process.env.DB_POOL_LIMIT || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Teacher Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Teacher Database connection failed:', error.message);
    return false;
  }
}

async function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS teachers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      teacher_id VARCHAR(20) UNIQUE NOT NULL,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(20),
      date_of_birth DATE,
      address TEXT,
      department VARCHAR(100),
      hire_date DATE DEFAULT (CURRENT_DATE),
      status ENUM('active', 'on_leave', 'retired') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Teachers table initialized');
    
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM teachers');
    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO teachers (teacher_id, first_name, last_name, email, phone, department) VALUES
        ('TCH001', 'John', 'Smith', 'john.smith@school.edu', '1234567890', 'Mathematics'),
        ('TCH002', 'Sarah', 'Johnson', 'sarah.j@school.edu', '0987654321', 'Science'),
        ('TCH003', 'Michael', 'Brown', 'michael.b@school.edu', '5551234567', 'English');
      `);
      console.log('✅ Sample teacher data inserted');
    }
  } catch (error) {
    console.error('❌ Error initializing teacher database:', error.message);
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
};