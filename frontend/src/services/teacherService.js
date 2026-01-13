import { teacherApi } from "./api";

const TeacherService = {
  async getTeachers(page = 1, limit = 10, filters = {}) {
    const params = { page, limit, ...filters };
    return teacherApi.getAll(params);
  },

  async getTeacherById(id) {
    return teacherApi.getById(id);
  },

  async createTeacher(teacherData) {
    return teacherApi.create(teacherData);
  },

  async updateTeacher(id, teacherData) {
    return teacherApi.update(id, teacherData);
  },

  async deleteTeacher(id) {
    return teacherApi.delete(id);
  },

  async searchTeachers(query) {
    return teacherApi.search(query);
  },
};

export default TeacherService;