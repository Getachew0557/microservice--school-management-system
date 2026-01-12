const { body, validationResult } = require('express-validator');

// Student validation rules
exports.validateStudent = [
  body('student_id')
    .notEmpty().withMessage('Student ID is required')
    .isLength({ min: 3, max: 20 }).withMessage('Student ID must be 3-20 characters'),
  
  body('first_name')
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
  
  body('last_name')
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  
  body('phone')
    .optional()
    .matches(/^[+]?[\d\s\-()]+$/).withMessage('Invalid phone number format'),
  
  body('date_of_birth')
    .optional()
    .isDate().withMessage('Invalid date format (YYYY-MM-DD)'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'graduated']).withMessage('Invalid status'),
  
  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array(),
      });
    }
    next();
  },
];