import React, { createContext, useContext, useState } from 'react';
import StudentService from '../services/studentService';
import TeacherService from '../services/teacherService';

const ApiContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    students: false,
    teachers: false,
    courses: false,
    grades: false,
  });

  // Wrapper for API calls with loading and error handling
  const apiCall = async (apiFunction, serviceType = 'general', ...args) => {
    setLoading(true);
    setError(null);
    
    // Set specific service loading state
    if (serviceType !== 'general') {
      setLoadingStates(prev => ({
        ...prev,
        [serviceType]: true
      }));
    }
    
    try {
      const result = await apiFunction(...args);
      setLoading(false);
      
      if (serviceType !== 'general') {
        setLoadingStates(prev => ({
          ...prev,
          [serviceType]: false
        }));
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      setLoading(false);
      
      if (serviceType !== 'general') {
        setLoadingStates(prev => ({
          ...prev,
          [serviceType]: false
        }));
      }
      
      throw err;
    }
  };

  // Student API methods
  const getStudents = (page = 1, limit = 10, filters = {}) => 
    apiCall(StudentService.getStudents, 'students', page, limit, filters);

  const getStudent = (id) => 
    apiCall(StudentService.getStudentById, 'students', id);

  const createStudent = (studentData) => 
    apiCall(StudentService.createStudent, 'students', studentData);

  const updateStudent = (id, studentData) => 
    apiCall(StudentService.updateStudent, 'students', id, studentData);

  const deleteStudent = (id) => 
    apiCall(StudentService.deleteStudent, 'students', id);

  const searchStudents = (query) => 
    apiCall(StudentService.searchStudents, 'students', query);

  // Teacher API methods
  const getTeachers = (page = 1, limit = 10, filters = {}) => 
    apiCall(TeacherService.getTeachers, 'teachers', page, limit, filters);

  const getTeacher = (id) => 
    apiCall(TeacherService.getTeacherById, 'teachers', id);

  const createTeacher = (teacherData) => 
    apiCall(TeacherService.createTeacher, 'teachers', teacherData);

  const updateTeacher = (id, teacherData) => 
    apiCall(TeacherService.updateTeacher, 'teachers', id, teacherData);

  const deleteTeacher = (id) => 
    apiCall(TeacherService.deleteTeacher, 'teachers', id);

  const searchTeachers = (query) => 
    apiCall(TeacherService.searchTeachers, 'teachers', query);

  // Dashboard methods
  const getDashboardStats = () => 
    apiCall(StudentService.getDashboardStats, 'students');

  const value = {
    // State
    loading,
    error,
    loadingStates,
    
    // Actions
    clearError: () => setError(null),
    clearAllErrors: () => {
      setError(null);
      setLoadingStates({
        students: false,
        teachers: false,
        courses: false,
        grades: false,
      });
    },
    
    // Student methods
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    
    // Teacher methods
    getTeachers,
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    searchTeachers,
    
    // Dashboard methods
    getDashboardStats,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};