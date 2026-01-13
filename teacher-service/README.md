# Teacher Service

Teacher management microservice for School Management System.

## API Endpoints

### Teachers
- `GET /api/teachers` - Get all teachers (with pagination)
- `GET /api/teachers/search?q=term` - Search students
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create new teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Health Check
- `GET /health` - Service health status

## Query Parameters for GET /api/teachers

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (active, inactive, graduated)
- `search` - Search term for name, email, or teacher ID

## Request Body Examples

**Create teacher:**
```json
{
  "teacher_id": "ST001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "date_of_birth": "2000-01-15",
  "address": "123 Main St",
  "status": "active"
}