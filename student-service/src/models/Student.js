const { pool } = require('../config/database');

class Student {
  // Get all students with pagination
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM students WHERE 1=1';
    const queryParams = [];
    
    // Apply filters
    if (filters.status) {
      query += ' AND status = ?';
      queryParams.push(filters.status);
    }
    
    if (filters.search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR student_id LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    // Add ordering and pagination
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);
    
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  // Get student by ID
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    return rows[0];
  }

  // Get student by student_id
  static async findByStudentId(studentId) {
    const [rows] = await pool.query('SELECT * FROM students WHERE student_id = ?', [studentId]);
    return rows[0];
  }

  // Create new student
  static async create(studentData) {
    const {
      student_id,
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      status = 'active',
    } = studentData;
    
    const [result] = await pool.query(
      `INSERT INTO students 
       (student_id, first_name, last_name, email, phone, date_of_birth, address, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [student_id, first_name, last_name, email, phone, date_of_birth, address, status]
    );
    
    return this.findById(result.insertId);
  }

  // Update student
  static async update(id, studentData) {
    const fields = [];
    const values = [];
    
    // Build dynamic update query
    Object.entries(studentData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    values.push(id);
    const query = `UPDATE students SET ${fields.join(', ')} WHERE id = ?`;
    
    const [result] = await pool.query(query, values);
    
    if (result.affectedRows === 0) {
      throw new Error('Student not found');
    }
    
    return this.findById(id);
  }

  // Delete student
  static async delete(id) {
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Count total students
  static async count(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM students WHERE 1=1';
    const queryParams = [];
    
    if (filters.status) {
      query += ' AND status = ?';
      queryParams.push(filters.status);
    }
    
    if (filters.search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR student_id LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    const [rows] = await pool.query(query, queryParams);
    return rows[0].total;
  }
}

module.exports = Student;