import axios from "axios";

const api = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
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
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.error("Unauthorized");
          window.location.href = "/login";
          break;
        case 503:
          console.error("Service unavailable:", data.message);
          break;
        default:
          console.error("Error:", data.message);
      }
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

// Student API methods
export const studentApi = {
  getAll: (params) => api.get("http://localhost:3001/api/students", { params }),
  getById: (id) => api.get(`http://localhost:3001/api/students/${id}`),
  create: (studentData) =>
    api.post("http://localhost:3001/api/students", studentData),
  update: (id, studentData) =>
    api.put(`http://localhost:3001/api/students/${id}`, studentData),
  delete: (id) => api.delete(`http://localhost:3001/api/students/${id}`),
  search: (query) =>
    api.get("http://localhost:3001/api/students/search", {
      params: { q: query },
    }),
  getDashboardStats: () =>
    api.get("http://localhost:3001/api/students/stats/dashboard"),
};

// Teacher API methods
// export const teacherApi = {
//   getAll: (params) => api.get('/teachers', { params }),
//   getById: (id) => api.get(`/teachers/${id}`),
//   create: (teacherData) => api.post('/teachers', teacherData),
//   update: (id, teacherData) => api.put(`/teachers/${id}`, teacherData),
//   delete: (id) => api.delete(`/teachers/${id}`),
//   search: (query) => api.get('/teachers/search', { params: { q: query } }),
//   getStats: () => api.get('/teachers/stats'),
// };

// Teacher API methods
export const teacherApi = {
  getAll: (params) => api.get("http://localhost:3002/api/teachers", { params }),
  getById: (id) => api.get(`http://localhost:3002/api/teachers/${id}`),
  create: (teacherData) =>
    api.post("http://localhost:3002/api/teachers", teacherData),
  update: (id, teacherData) =>
    api.put(`http://localhost:3002/api/teachers/${id}`, teacherData),
  delete: (id) => api.delete(`http://localhost:3002/api/teachers/${id}`),
  search: (query) =>
    api.get("http://localhost:3002/api/teachers/search", {
      params: { q: query },
    }),
};

// Course API methods (for future use)
export const courseApi = {
  getAll: (params) => api.get("/courses", { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (courseData) => api.post("/courses", courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: (id) => api.delete(`/courses/${id}`),
};

// Grade API methods (for future use)
export const gradeApi = {
  getAll: (params) => api.get("/grades", { params }),
  getById: (id) => api.get(`/grades/${id}`),
  create: (gradeData) => api.post("/grades", gradeData),
  update: (id, gradeData) => api.put(`/grades/${id}`, gradeData),
  delete: (id) => api.delete(`/grades/${id}`),
};

export default api;
