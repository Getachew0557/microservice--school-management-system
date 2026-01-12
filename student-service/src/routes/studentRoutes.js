const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
} = require('../controllers/studentController');

// GET /api/students - Get all students
router.get('/', getAllStudents);

// GET /api/students/search - Search students
router.get('/search', searchStudents);

// GET /api/students/:id - Get single student
router.get('/:id', getStudentById);

// POST /api/students - Create new student
router.post('/', createStudent);

// PUT /api/students/:id - Update student
router.put('/:id', updateStudent);

// DELETE /api/students/:id - Delete student
router.delete('/:id', deleteStudent);

module.exports = router;