# School Management System - Starter Templates

Complete starter templates for building a modern school management system with microservices architecture.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL 15+
- Redis 7+
- Docker and Docker Compose (optional, but recommended)

### Option 1: Using Docker Compose (Recommended)

1. **Clone or copy the starter templates**

2. **Navigate to the root directory**

3. **Start all services**:
   ```bash
   docker-compose up
   ```

This will start:
- PostgreSQL database
- Redis cache
- Backend API (Node.js + Express)
- Frontend (React + Vite)

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Backend will run on `http://localhost:3000`

#### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
starter-templates/
├── backend/              # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/ # Route handlers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Custom middleware
│   │   ├── utils/       # Utility functions
│   │   └── server.ts    # Express app
│   ├── prisma/          # Prisma schema and migrations
│   └── package.json
│
├── frontend/            # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   ├── services/    # API services
│   │   └── App.tsx      # Root component
│   └── package.json
│
└── docker-compose.yml   # Docker Compose for all services
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Prisma ORM)
- **Cache**: Redis
- **Authentication**: JWT

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit + React Query
- **UI**: Material-UI + Tailwind CSS
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

## 📚 Documentation

- [Backend README](./backend/README.md) - Backend setup and API documentation
- [Frontend README](./frontend/README.md) - Frontend setup and development guide
- [Architecture Documentation](../MICROSERVICES_ARCHITECTURE.md) - Complete microservices architecture
- [Implementation Roadmap](../IMPLEMENTATION_ROADMAP.md) - Step-by-step implementation guide
- [Tech Stack Details](../TECH_STACK_DETAILS.md) - Detailed technology stack information

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Lint code
npm run prisma:studio # Open Prisma Studio
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Lint code
```

## 🐳 Docker

### Start all services

```bash
docker-compose up
```

### Start specific services

```bash
docker-compose up postgres redis    # Only database services
docker-compose up api               # Only backend API
docker-compose up frontend         # Only frontend
```

### Stop all services

```bash
docker-compose down
```

### Rebuild containers

```bash
docker-compose up --build
```

## 📝 Environment Variables

### Backend (.env)

See [backend/.env.example](./backend/.env.example) for all backend environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_HOST` - Redis host
- `JWT_SECRET` - JWT secret key
- `CORS_ORIGIN` - Frontend URL

### Frontend (.env)

See [frontend/.env.example](./frontend/.env.example) for all frontend environment variables.

Key variables:
- `VITE_API_URL` - Backend API URL

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
npm run test:watch
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend
npm test
npm run test:ui
npm run test:coverage
```

## 📦 Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
# Serve the dist/ directory with a web server
```

## 🚀 Deployment

### Backend Deployment

1. Build Docker image:
   ```bash
   cd backend
   docker build -t school-management-api .
   ```

2. Run container:
   ```bash
   docker run -p 3000:3000 --env-file .env school-management-api
   ```

### Frontend Deployment

1. Build Docker image:
   ```bash
   cd frontend
   docker build -t school-management-frontend .
   ```

2. Run container:
   ```bash
   docker run -p 80:80 school-management-frontend
   ```

## 📋 Next Steps

1. **Set up your database**: Update Prisma schema and run migrations
2. **Configure authentication**: Set up JWT secrets and authentication flow
3. **Create your first microservice**: Follow the architecture documentation
4. **Set up CI/CD**: Configure GitHub Actions or GitLab CI
5. **Add monitoring**: Set up logging and monitoring tools

## 🤝 Contributing

1. Review the architecture documentation
2. Follow the code style guidelines (ESLint + Prettier)
3. Write tests for new features
4. Update documentation as needed

## 📄 License

ISC

## 🆘 Support

For questions or issues:
1. Check the documentation files
2. Review the architecture documentation
3. Check existing issues
4. Create a new issue with detailed information

---

**Happy Coding! 🎉**
