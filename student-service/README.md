# Student Service

Student management microservice for School Management System.

## API Endpoints

### Students
- `GET /api/students` - Get all students (with pagination)
- `GET /api/students/search?q=term` - Search students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Health Check
- `GET /health` - Service health status

## Query Parameters for GET /api/students

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (active, inactive, graduated)
- `search` - Search term for name, email, or student ID

## Request Body Examples

**Create Student:**
```json
{
  "student_id": "ST001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "date_of_birth": "2000-01-15",
  "address": "123 Main St",
  "status": "active"
}