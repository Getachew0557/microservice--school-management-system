const { pool } = require('../config/database');

class Teacher {
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM teachers WHERE 1=1';
    const queryParams = [];
    
    if (filters.status) {
      query += ' AND status = ?';
      queryParams.push(filters.status);
    }
    
    if (filters.department) {
      query += ' AND department = ?';
      queryParams.push(filters.department);
    }
    
    if (filters.search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR teacher_id LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);
    
    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByTeacherId(teacherId) {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE teacher_id = ?', [teacherId]);
    return rows[0];
  }

  static async create(teacherData) {
    const {
      teacher_id,
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      department,
      status = 'active',
    } = teacherData;
    
    const [result] = await pool.query(
      `INSERT INTO teachers 
       (teacher_id, first_name, last_name, email, phone, date_of_birth, address, department, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [teacher_id, first_name, last_name, email, phone, date_of_birth, address, department, status]
    );
    
    return this.findById(result.insertId);
  }

  static async update(id, teacherData) {
    const fields = [];
    const values = [];
    
    Object.entries(teacherData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    values.push(id);
    const query = `UPDATE teachers SET ${fields.join(', ')} WHERE id = ?`;
    
    const [result] = await pool.query(query, values);
    
    if (result.affectedRows === 0) {
      throw new Error('Teacher not found');
    }
    
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM teachers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async count(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM teachers WHERE 1=1';
    const queryParams = [];
    
    if (filters.status) {
      query += ' AND status = ?';
      queryParams.push(filters.status);
    }
    
    if (filters.department) {
      query += ' AND department = ?';
      queryParams.push(filters.department);
    }
    
    if (filters.search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR teacher_id LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    const [rows] = await pool.query(query, queryParams);
    return rows[0].total;
  }
}

module.exports = Teacher;