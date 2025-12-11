# School Management System - Backend API

Backend API for the School Management System built with Node.js, Express.js, TypeScript, and Prisma.

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (with Prisma ORM)
- **Cache**: Redis
- **Authentication**: JWT

## Prerequisites

- Node.js 20+ and npm
- PostgreSQL 15+
- Redis 7+
- Docker and Docker Compose (optional)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Using Docker

### Start all services (PostgreSQL, Redis, API)

```bash
docker-compose up
```

### Start only database services

```bash
docker-compose up postgres redis
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting errors
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── models/          # Database models (Prisma)
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── validators/      # Validation schemas
│   └── server.ts        # Express app setup
├── prisma/
│   └── schema.prisma    # Prisma schema
├── tests/               # Test files
├── logs/                # Log files
├── package.json
├── tsconfig.json
└── Dockerfile
```

## API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### API Info
- `GET /api` - API information

## Environment Variables

See `.env.example` for all available environment variables.

## Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Code Quality

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

## License

ISC
