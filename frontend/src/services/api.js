import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3001/api",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error("Bad Request:", data.message);
          break;
        case 401:
          console.error("Unauthorized");
          // Redirect to login
          window.location.href = "/login";
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("Error:", data.message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error("No response received:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

// Student API methods
export const studentApi = {
  // Get all students
  getAll: (params) => api.get("/students", { params }),

  // Get student by ID
  getById: (id) => api.get(`/students/${id}`),

  // Create new student
  create: (studentData) => api.post("/students", studentData),

  // Update student
  update: (id, studentData) => api.put(`/students/${id}`, studentData),

  // Delete student
  delete: (id) => api.delete(`/students/${id}`),

  // Search students
  search: (query) => api.get("/students/search", { params: { q: query } }),
};
