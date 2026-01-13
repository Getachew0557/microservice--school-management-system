const request = require('supertest');
const app = require('../server');

// Mock the database module similar to student tests
jest.mock('../config/database', () => {
  const mockTeachers = [];
  let idCounter = 1;

  return {
    pool: {
      query: jest.fn().mockImplementation((sql, params) => {
        // Handle CREATE TABLE / DROP / ALTER
        if (sql.includes('CREATE TABLE')) return Promise.resolve([[], []]);
        if (sql.includes('DELETE FROM teachers')) {
          mockTeachers.length = 0;
          idCounter = 1;
          return Promise.resolve([{ affectedRows: 0 }, []]);
        }
        if (sql.includes('ALTER TABLE')) return Promise.resolve([[], []]);
        if (sql.includes('SELECT * FROM teachers')) return Promise.resolve([mockTeachers, []]);
        if (sql.includes('SELECT COUNT(*)')) return Promise.resolve([[{ total: mockTeachers.length }], []]);
        if (sql.includes('INSERT INTO teachers')) {
          const teacher = {
            id: idCounter++,
            teacher_id: params[0],
            first_name: params[1],
            last_name: params[2],
            email: params[3],
            phone: params[4] || null,
            department: params[5] || null,
            hire_date: params[6] || null,
            status: params[7] || 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          mockTeachers.push(teacher);
          return Promise.resolve([{ insertId: teacher.id }, []]);
        }
        if (sql.includes('WHERE id = ?')) {
          const teacher = mockTeachers.find(t => t.id === params[0]);
          return Promise.resolve([[teacher], []]);
        }
        return Promise.resolve([[], []]);
      }),
      end: jest.fn().mockResolvedValue(undefined),
    },
    testConnection: jest.fn().mockResolvedValue(true),
    initializeDatabase: jest.fn().mockResolvedValue(undefined),
  };
});

describe('Teacher API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/teachers', () => {
    it('should return empty array when no teachers', async () => {
      const response = await request(app).get('/api/teachers');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual([]);
    });
  });

  describe('POST /api/teachers', () => {
    it('should return 400 for missing required fields', async () => {
      const invalidTeacher = {
        first_name: 'Jane',
        // Missing teacher_id, last_name, email
      };

      const response = await request(app).post('/api/teachers').send(invalidTeacher);
      expect(response.status).toBe(400);
    });
  });
});