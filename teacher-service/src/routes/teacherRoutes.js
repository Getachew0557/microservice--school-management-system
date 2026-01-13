const express = require('express');
const teacherRouter = express.Router(); // ✅ Changed variable name
const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teacherController');

// GET /api/teachers - Get all teachers
teacherRouter.get('/', getAllTeachers);

// GET /api/teachers/search - Search teachers (add this function to controller)
// teacherRouter.get('/search', searchTeachers);

// GET /api/teachers/:id - Get single teacher
teacherRouter.get('/:id', getTeacherById);

// POST /api/teachers - Create new teacher
teacherRouter.post('/', createTeacher);

// PUT /api/teachers/:id - Update teacher
teacherRouter.put('/:id', updateTeacher);

// DELETE /api/teachers/:id - Delete teacher
teacherRouter.delete('/:id', deleteTeacher);

module.exports = teacherRouter; // ✅ Changed export