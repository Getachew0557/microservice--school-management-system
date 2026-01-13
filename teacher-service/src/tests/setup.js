// Test setup file
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'test_teacher_db';

// Suppress console.log during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};