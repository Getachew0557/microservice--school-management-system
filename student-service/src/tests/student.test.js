const request = require('supertest');
const app = require('../server');

// Mock the database module
jest.mock('../config/database', () => {
  const mockStudents = [];
  let idCounter = 1;

  return {
    pool: {
      query: jest.fn().mockImplementation((sql, params) => {
        console.log('Mock query:', sql.substring(0, 50) + '...');
        
        // Handle specific queries
        if (sql.includes('CREATE TABLE')) {
          return Promise.resolve([[], []]);
        }
        
        if (sql.includes('DELETE FROM students')) {
          mockStudents.length = 0;
          idCounter = 1;
          return Promise.resolve([{ affectedRows: 0 }, []]);
        }
        
        if (sql.includes('ALTER TABLE')) {
          return Promise.resolve([[], []]);
        }
        
        if (sql.includes('SELECT * FROM students')) {
          return Promise.resolve([mockStudents, []]);
        }
        
        if (sql.includes('SELECT COUNT(*)')) {
          return Promise.resolve([[{ total: mockStudents.length }], []]);
        }
        
        if (sql.includes('INSERT INTO students')) {
          const student = {
            id: idCounter++,
            student_id: params[0],
            first_name: params[1],
            last_name: params[2],
            email: params[3],
            phone: params[4] || null,
            date_of_birth: params[5] || null,
            address: params[6] || null,
            status: params[7] || 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          mockStudents.push(student);
          return Promise.resolve([{ insertId: student.id }, []]);
        }
        
        if (sql.includes('WHERE id = ?')) {
          const student = mockStudents.find(s => s.id === params[0]);
          return Promise.resolve([[student], []]);
        }
        
        return Promise.resolve([[], []]);
      }),
      end: jest.fn().mockResolvedValue(undefined),
    },
    testConnection: jest.fn().mockResolvedValue(true),
    initializeDatabase: jest.fn().mockResolvedValue(undefined),
  };
});

describe('Student API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/students', () => {
    it('should return empty array when no students', async () => {
      const response = await request(app).get('/api/students');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual([]);
    });
  });

  describe('POST /api/students', () => {
    it('should return 400 for missing required fields', async () => {
      const invalidStudent = {
        first_name: 'Jane',
        // Missing student_id, last_name, email
      };

      const response = await request(app)
        .post('/api/students')
        .send(invalidStudent);
      
      expect(response.status).toBe(400);
    });
  });
});