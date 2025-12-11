# School Management System - Microservices

This directory contains all microservices for the School Management System.

## Architecture Overview

Each microservice is:
- Independently deployable
- Has its own database (where applicable)
- Communicates via REST APIs
- Can scale independently

## Services

### Core Services (Phase 1)
1. **auth-service** - Authentication & Authorization
2. **student-service** - Student Information Management
3. **academic-service** - Academic Management (Classes, Subjects, Curriculum)

### Infrastructure Services
- **api-gateway** - API Gateway for routing requests
- **shared** - Shared utilities and types

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (for each service)
- Redis (shared)

### Quick Start

```bash
# Start all services
docker-compose up

# Or start individual services
cd auth-service && npm run dev
```

## Service Communication

Services communicate via:
- **Synchronous**: HTTP REST APIs
- **Asynchronous**: Message Queue (RabbitMQ/Kafka) for events
- **Service Discovery**: Via API Gateway

## Development

Each service follows the same structure:
```
service-name/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   └── server.ts
├── prisma/
├── Dockerfile
└── package.json
```

## Environment Variables

Each service has its own `.env` file. See `.env.example` in each service directory.

## Testing

```bash
# Test all services
npm run test:all

# Test specific service
cd auth-service && npm test
```

## Deployment

Each service can be deployed independently using Docker.
