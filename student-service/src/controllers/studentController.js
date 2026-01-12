const Student = require('../models/Student');

// Get all students
exports.getAllStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;
    
    const filters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    
    const students = await Student.findAll(page, limit, filters);
    const total = await Student.count(filters);
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      status: 'success',
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Search students
exports.searchStudents = async (req, res, next) => {
  try {
    const search = req.query.q;
    if (!search) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required',
      });
    }
    
    const students = await Student.findAll(1, 50, { search });
    const total = await Student.count({ search });
    
    res.status(200).json({
      status: 'success',
      data: students,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// Get student by ID
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// Create new student
exports.createStudent = async (req, res, next) => {
  try {
    const {
      student_id,
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      status,
    } = req.body;
    
    // Basic validation
    if (!student_id || !first_name || !last_name || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'student_id, first_name, last_name, and email are required',
      });
    }
    
    // Check if student_id or email already exists
    const existingStudent = await Student.findByStudentId(student_id);
    if (existingStudent) {
      return res.status(400).json({
        status: 'error',
        message: 'Student ID already exists',
      });
    }
    
    // In real app, also check email uniqueness
    
    const student = await Student.create({
      student_id,
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      status,
    });
    
    res.status(201).json({
      status: 'success',
      data: student,
      message: 'Student created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Update student
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found',
      });
    }
    
    const updatedStudent = await Student.update(req.params.id, req.body);
    
    res.status(200).json({
      status: 'success',
      data: updatedStudent,
      message: 'Student updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete student
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found',
      });
    }
    
    await Student.delete(req.params.id);
    
    res.status(200).json({
      status: 'success',
      message: 'Student deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};