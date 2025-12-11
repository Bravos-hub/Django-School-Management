# Quick Start Guide

Get your School Management System up and running in minutes!

## 🚀 Fastest Way (Docker Compose)

1. **Navigate to starter-templates directory**
   ```bash
   cd starter-templates
   ```

2. **Start all services**
   ```bash
   docker-compose up
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Health: http://localhost:3000/health

That's it! 🎉

## 📋 Manual Setup (Step by Step)

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/school_management"

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

Backend should now be running on `http://localhost:3000`

### Step 2: Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file
# VITE_API_URL=http://localhost:3000/api/v1

# Start development server
npm run dev
```

Frontend should now be running on `http://localhost:5173`

## ✅ Verify Installation

### Backend Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### Frontend

Open http://localhost:5173 in your browser. You should see the home page.

## 🔐 Test Authentication

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

You should receive a token in the response.

## 📁 Project Structure Overview

```
starter-templates/
├── backend/              # Node.js API
│   ├── src/
│   │   ├── config/       # Database, Redis config
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, error handling
│   │   └── utils/        # Helpers
│   └── prisma/           # Database schema
│
└── frontend/            # React App
    └── src/
        ├── components/   # UI components
        ├── pages/        # Page components
        ├── store/        # Redux store
        └── services/     # API calls
```

## 🛠️ Common Commands

### Backend

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Check code quality
npm run prisma:studio # Open database GUI
```

### Frontend

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Check code quality
```

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use:

**Backend**: Change `PORT` in `backend/.env`
**Frontend**: Change port in `frontend/vite.config.ts`

### Database Connection Error

1. Make sure PostgreSQL is running
2. Check `DATABASE_URL` in `backend/.env`
3. Verify database exists: `createdb school_management`

### Redis Connection Error

1. Make sure Redis is running: `redis-server`
2. Check `REDIS_HOST` and `REDIS_PORT` in `backend/.env`

### CORS Errors

Make sure `CORS_ORIGIN` in `backend/.env` matches your frontend URL.

## 📚 Next Steps

1. **Explore the code**: Check out the example auth implementation
2. **Read the docs**: See README.md files in backend/ and frontend/
3. **Set up your first microservice**: Follow the architecture documentation
4. **Customize**: Update Prisma schema, add your own routes

## 🆘 Need Help?

- Check the main [README.md](./README.md)
- Review [Backend README](./backend/README.md)
- Review [Frontend README](./frontend/README.md)
- See [Architecture Documentation](../MICROSERVICES_ARCHITECTURE.md)

---

**Happy Coding! 🚀**
