import React, { createContext, useContext, useState } from 'react';
import StudentService from '../services/studentService';

const ApiContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Wrapper for API calls with loading and error handling
  const apiCall = async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Student API methods
  const getStudents = (page, limit, filters) => 
    apiCall(StudentService.getStudents, page, limit, filters);

  const getStudent = (id) => 
    apiCall(StudentService.getStudentById, id);

  const createStudent = (studentData) => 
    apiCall(StudentService.createStudent, studentData);

  const updateStudent = (id, studentData) => 
    apiCall(StudentService.updateStudent, id, studentData);

  const deleteStudent = (id) => 
    apiCall(StudentService.deleteStudent, id);

  const searchStudents = (query) => 
    apiCall(StudentService.searchStudents, query);

  const value = {
    loading,
    error,
    clearError: () => setError(null),
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};