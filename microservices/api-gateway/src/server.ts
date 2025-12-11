import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'api-gateway',
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
      student: process.env.STUDENT_SERVICE_URL || 'http://localhost:3002',
      academic: process.env.ACADEMIC_SERVICE_URL || 'http://localhost:3003',
    },
  });
});

// Proxy middleware configuration
const createServiceProxy = (target: string, pathRewrite?: { [key: string]: string }) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    onProxyReq: (proxyReq, req, res) => {
      // Forward original headers
      if (req.headers.authorization) {
        proxyReq.setHeader('Authorization', req.headers.authorization);
      }
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      (res as any).status(503).json({
        success: false,
        error: {
          message: 'Service temporarily unavailable',
          code: 'SERVICE_UNAVAILABLE',
        },
      });
    },
  });
};

// Auth Service Routes
app.use(
  '/api/v1/auth',
  createServiceProxy(process.env.AUTH_SERVICE_URL || 'http://localhost:3001', {
    '^/api/v1/auth': '/api/v1/auth',
  })
);

app.use(
  '/api/v1/users',
  createServiceProxy(process.env.AUTH_SERVICE_URL || 'http://localhost:3001', {
    '^/api/v1/users': '/api/v1/users',
  })
);

// Student Service Routes
app.use(
  '/api/v1/students',
  createServiceProxy(process.env.STUDENT_SERVICE_URL || 'http://localhost:3002', {
    '^/api/v1/students': '/api/v1/students',
  })
);

app.use(
  '/api/v1/admissions',
  createServiceProxy(process.env.STUDENT_SERVICE_URL || 'http://localhost:3002', {
    '^/api/v1/admissions': '/api/v1/admissions',
  })
);

// Academic Service Routes
app.use(
  '/api/v1/classes',
  createServiceProxy(process.env.ACADEMIC_SERVICE_URL || 'http://localhost:3003', {
    '^/api/v1/classes': '/api/v1/classes',
  })
);

app.use(
  '/api/v1/subjects',
  createServiceProxy(process.env.ACADEMIC_SERVICE_URL || 'http://localhost:3003', {
    '^/api/v1/subjects': '/api/v1/subjects',
  })
);

app.use(
  '/api/v1/academic-years',
  createServiceProxy(process.env.ACADEMIC_SERVICE_URL || 'http://localhost:3003', {
    '^/api/v1/academic-years': '/api/v1/academic-years',
  })
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND',
    },
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Proxying to:`);
  console.log(`  - Auth Service: ${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}`);
  console.log(`  - Student Service: ${process.env.STUDENT_SERVICE_URL || 'http://localhost:3002'}`);
  console.log(`  - Academic Service: ${process.env.ACADEMIC_SERVICE_URL || 'http://localhost:3003'}`);
});

export default app;
