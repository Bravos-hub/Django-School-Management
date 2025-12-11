# Assessment & Results Service

Microservice responsible for managing exams, assessments, and student results.

## Features

- Exam creation and management
- Result entry and management
- Bulk result entry
- Report card generation
- Grade calculation
- UCE/UACE/PLE exam support

## API Endpoints

### Exams
- `GET /api/v1/exams` - Get all exams
- `GET /api/v1/exams/:id` - Get exam by ID
- `POST /api/v1/exams` - Create exam (Admin/Teacher)
- `PUT /api/v1/exams/:id` - Update exam (Admin/Teacher)
- `DELETE /api/v1/exams/:id` - Delete exam (Admin)

### Results
- `GET /api/v1/results` - Get all results
- `GET /api/v1/results/:id` - Get result by ID
- `POST /api/v1/results` - Create result (Admin/Teacher)
- `POST /api/v1/results/bulk` - Bulk create results (Admin/Teacher)
- `PUT /api/v1/results/:id` - Update result (Admin/Teacher)

### Report Cards
- `GET /api/v1/report-cards/student/:studentId` - Get student report cards
- `POST /api/v1/report-cards/generate` - Generate report card

## Port

Default port: `3004`
