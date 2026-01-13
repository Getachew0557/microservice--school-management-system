const Teacher = require('../models/Teacher');

exports.getAllTeachers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const department = req.query.department;
    const search = req.query.search;
    
    const filters = {};
    if (status) filters.status = status;
    if (department) filters.department = department;
    if (search) filters.search = search;
    
    const teachers = await Teacher.findAll(page, limit, filters);
    const total = await Teacher.count(filters);
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      status: 'success',
      data: teachers,
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

exports.getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

exports.createTeacher = async (req, res, next) => {
  try {
    const {
      teacher_id,
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      department,
      status,
    } = req.body;
    
    if (!teacher_id || !first_name || !last_name || !email || !department) {
      return res.status(400).json({
        status: 'error',
        message: 'teacher_id, first_name, last_name, email, and department are required',
      });
    }
    
    const existingTeacher = await Teacher.findByTeacherId(teacher_id);
    if (existingTeacher) {
      return res.status(400).json({
        status: 'error',
        message: 'Teacher ID already exists',
      });
    }
    
    const teacher = await Teacher.create({
      teacher_id,
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      department,
      status,
    });
    
    res.status(201).json({
      status: 'success',
      data: teacher,
      message: 'Teacher created successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher not found',
      });
    }
    
    const updatedTeacher = await Teacher.update(req.params.id, req.body);
    
    res.status(200).json({
      status: 'success',
      data: updatedTeacher,
      message: 'Teacher updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher not found',
      });
    }
    
    await Teacher.delete(req.params.id);
    
    res.status(200).json({
      status: 'success',
      message: 'Teacher deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};