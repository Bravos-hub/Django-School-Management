# Quick Start Guide - Microservices

Get all microservices running quickly!

## 🚀 Using Docker Compose (Recommended)

1. **Navigate to microservices directory**
   ```bash
   cd microservices
   ```

2. **Start all services**
   ```bash
   docker-compose up
   ```

This will start:
- 3 PostgreSQL databases (one per service)
- Redis cache
- Auth Service (port 3001)
- Student Service (port 3002)
- Academic Service (port 3003)
- API Gateway (port 3000)

## 📋 Manual Setup

### Prerequisites
- Node.js 20+
- PostgreSQL (3 instances or use different ports)
- Redis

### Step 1: Setup Databases

Create three databases:
```bash
createdb auth_db
createdb student_db
createdb academic_db
```

### Step 2: Setup Auth Service

```bash
cd auth-service
npm install
cp .env.example .env
# Edit .env with your database URL
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Step 3: Setup Student Service

```bash
cd student-service
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Step 4: Setup Academic Service

```bash
cd academic-service
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Step 5: Setup API Gateway

```bash
cd api-gateway
npm install
cp .env.example .env
npm run dev
```

## ✅ Verify Services

### Health Checks

```bash
# API Gateway
curl http://localhost:3000/health

# Auth Service
curl http://localhost:3001/health

# Student Service
curl http://localhost:3002/health

# Academic Service
curl http://localhost:3003/health
```

## 🧪 Test Authentication

### Register a User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "password123",
    "role": "ADMIN"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "password123"
  }'
```

Save the token from the response.

### Get Current User

```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📊 Service Ports

- **API Gateway**: 3000
- **Auth Service**: 3001
- **Student Service**: 3002
- **Academic Service**: 3003
- **PostgreSQL Auth**: 5433
- **PostgreSQL Student**: 5434
- **PostgreSQL Academic**: 5435
- **Redis**: 6379

## 🔧 Development

All services support hot reload in development mode. Changes to source files will automatically restart the service.

## 📚 Next Steps

1. Explore the API endpoints through the API Gateway
2. Check individual service READMEs for detailed documentation
3. Start building additional microservices
4. Set up monitoring and logging

---

**Happy Coding! 🚀**
