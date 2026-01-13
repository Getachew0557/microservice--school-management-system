// Test setup file
process.env.NODE_ENV = 'test';

// Set test environment variables
process.env.TEST_DB_HOST = 'localhost';
process.env.TEST_DB_PORT = '3306';
process.env.TEST_DB_USER = 'root';
process.env.TEST_DB_PASSWORD = 'Abc@1221';
process.env.TEST_DB_NAME = 'test_student_db';

// Suppress console.log during tests if you want
// Or keep them for debugging
jest.setTimeout(10000); // Increase timeout for database operations