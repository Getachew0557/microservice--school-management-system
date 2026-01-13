import { studentApi } from "./api";

const StudentService = {
  async getStudents(page = 1, limit = 10, filters = {}) {
    const params = { page, limit, ...filters };
    return studentApi.getAll(params);
  },

  async getStudentById(id) {
    return studentApi.getById(id);
  },

  async createStudent(studentData) {
    return studentApi.create(studentData);
  },

  async updateStudent(id, studentData) {
    return studentApi.update(id, studentData);
  },

  async deleteStudent(id) {
    return studentApi.delete(id);
  },

  async searchStudents(query) {
    return studentApi.search(query);
  },
};

export default StudentService;
