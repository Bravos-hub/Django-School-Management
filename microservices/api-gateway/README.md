# API Gateway

Central entry point for all microservices. Routes requests to appropriate services.

## Features

- Request routing to microservices
- Rate limiting
- CORS handling
- Health check aggregation

## Routes

- `/api/v1/auth/*` → Auth Service
- `/api/v1/users/*` → Auth Service
- `/api/v1/students/*` → Student Service
- `/api/v1/admissions/*` → Student Service
- `/api/v1/classes/*` → Academic Service
- `/api/v1/subjects/*` → Academic Service
- `/api/v1/academic-years/*` → Academic Service

## Port

Default port: `3000`
