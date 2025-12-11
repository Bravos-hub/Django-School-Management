# Authentication & Authorization Service

Microservice responsible for user authentication and authorization.

## Features

- User registration and login
- JWT token generation and validation
- Refresh token management
- Password hashing with bcrypt
- Session management with Redis
- Role-based access control (RBAC)
- Rate limiting for auth endpoints

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user

## Environment Variables

See `.env.example` for all environment variables.

## Running Locally

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Database Schema

- `User` - User accounts
- `RefreshToken` - Refresh tokens for JWT

## Port

Default port: `3001`
