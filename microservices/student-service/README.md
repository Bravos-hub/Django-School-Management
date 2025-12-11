# Student Information Management Service

Microservice responsible for managing student information, admissions, and student-related data.

## Features

- Student CRUD operations
- Admission management
- Parent/Guardian management
- Student document management
- Student status tracking

## API Endpoints

### Students
- `GET /api/v1/students` - Get all students (with pagination)
- `GET /api/v1/students/:id` - Get student by ID
- `POST /api/v1/students` - Create new student
- `PUT /api/v1/students/:id` - Update student
- `DELETE /api/v1/students/:id` - Delete student

## Environment Variables

See `.env.example` for all environment variables.

## Running Locally

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Port

Default port: `3002`
