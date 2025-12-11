# Attendance Management Service

Microservice responsible for managing student and staff attendance.

## Features

- Daily attendance marking
- Bulk attendance marking
- Period-wise attendance (for secondary schools)
- Attendance summaries
- Leave applications
- Attendance percentage calculation
- Absence notifications (SMS integration ready)

## API Endpoints

### Attendance
- `GET /api/v1/attendances` - Get all attendances (with filters)
- `POST /api/v1/attendances` - Mark attendance (Admin/Teacher)
- `POST /api/v1/attendances/bulk` - Bulk mark attendance (Admin/Teacher)

### Attendance Summaries
- `GET /api/v1/attendance-summaries/student/:studentId` - Get student summaries
- `POST /api/v1/attendance-summaries/generate` - Generate summary

### Leave Applications
- Leave application routes (to be implemented)

## Attendance Statuses

- PRESENT
- ABSENT
- LATE
- EXCUSED
- SICK

## Port

Default port: `3006`
