# School Management System - Frontend

Frontend application for the School Management System built with React, Vite, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit + React Query
- **UI Library**: Material-UI (MUI) + Tailwind CSS
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Routing**: React Router v6

## Prerequisites

- Node.js 20+ and npm
- Backend API running (see backend README)

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

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting errors
- `npm run format` - Format code with Prettier

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Redux store
│   │   └── slices/      # Redux slices
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── styles/          # Global styles
│   ├── test/            # Test utilities
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## Features

- ✅ TypeScript for type safety
- ✅ Redux Toolkit for state management
- ✅ React Query for server state
- ✅ React Hook Form + Zod for form validation
- ✅ Tailwind CSS for styling
- ✅ Material-UI components
- ✅ Protected routes
- ✅ API integration with Axios
- ✅ Error handling
- ✅ Toast notifications

## Environment Variables

See `.env.example` for all available environment variables.

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Docker

### Build Docker image

```bash
docker build -t school-management-frontend .
```

### Run Docker container

```bash
docker run -p 80:80 school-management-frontend
```

## Code Quality

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

## License

ISC
