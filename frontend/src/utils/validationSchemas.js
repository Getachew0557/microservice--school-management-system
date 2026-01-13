import * as yup from 'yup';

export const studentSchema = yup.object().shape({
  student_id: yup
    .string()
    .required('Student ID is required')
    .min(3, 'Student ID must be at least 3 characters')
    .max(20, 'Student ID must be at most 20 characters'),
  
  first_name: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters'),
  
  last_name: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  
  phone: yup
    .string()
    .nullable()
    .matches(/^[+]?[\d\s\-()]+$/, 'Invalid phone number format'),
  
  date_of_birth: yup
    .date()
    .nullable()
    .max(new Date(), 'Date of birth cannot be in the future'),
  
  address: yup
    .string()
    .nullable()
    .max(500, 'Address must be at most 500 characters'),
  
  status: yup
    .string()
    .oneOf(['active', 'inactive', 'graduated'], 'Invalid status')
    .default('active'),
});