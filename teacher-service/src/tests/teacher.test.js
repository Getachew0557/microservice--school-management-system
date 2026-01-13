const request = require('supertest');
const app = require('../server');
const { pool } = require('../config/database');

describe('Teacher API', () => {
  beforeAll(async () => {
    // Create test database and tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        teacher_id VARCHAR(20) UNIQUE NOT NULL,
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
      )
    `);
  });

  beforeEach(async () => {
    // Clear teachers table before each test
    await pool.query('DELETE FROM teachers');
    // Reset auto increment
    await pool.query('ALTER TABLE teachers AUTO_INCREMENT = 1');
  });

  afterAll(async () => {
    // Close database connection
    await pool.end();
  });

  describe('GET /api/teachers', () => {
    it('should return empty array when no teachers', async () => {
      const response = await request(app).get('/api/teachers');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual([]);
    });

    it('should return all teachers', async () => {
      // Insert test data
      await pool.query(`
        INSERT INTO teachers (teacher_id, first_name, last_name, email) 
        VALUES ('TE001', 'John', 'Doe', 'john@test.com')
      `);

      const response = await request(app).get('/api/teachers');
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].first_name).toBe('John');
    });
  });

  describe('GET /api/teachers/:id', () => {
    it('should return 404 for non-existent teacher', async () => {
      const response = await request(app).get('/api/teachers/999');
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Teacher not found');
    });

    it('should return teacher by id', async () => {
      // Insert test data
      await pool.query(`
        INSERT INTO teachers (teacher_id, first_name, last_name, email) 
        VALUES ('TE001', 'John', 'Doe', 'john@test.com')
      `);

      const response = await request(app).get('/api/teachers/1');
      
      expect(response.status).toBe(200);
      expect(response.body.data.teacher_id).toBe('TE001');
    });
  });

  describe('POST /api/teachers', () => {
    it('should create a new teacher', async () => {
      const newTeacher = {
        teacher_id: 'TE001',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@test.com',
        phone: '1234567890',
        date_of_birth: '2000-01-01',
        address: '123 Test St',
      };

      const response = await request(app)
        .post('/api/students')
        .send(newStudent);
      
      expect(response.status).toBe(201);
      expect(response.body.data.first_name).toBe('Jane');
      expect(response.body.message).toBe('Student created successfully');
    });

    it('should return 400 for missing required fields', async () => {
      const invalidStudent = {
        first_name: 'Jane',
        // Missing student_id, last_name, email
      };

      const response = await request(app)
        .post('/api/teachers')
        .send(newTeacher);
      
      expect(response.status).toBe(201);
      expect(response.body.data.first_name).toBe('Jane');
      expect(response.body.message).toBe('Teacher created successfully');
    });
  });

  // Add more tests for PUT and DELETE
});