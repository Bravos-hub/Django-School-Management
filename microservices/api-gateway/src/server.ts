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
      assessment: process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:3004',
      fee: process.env.FEE_SERVICE_URL || 'http://localhost:3005',
      attendance: process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3006',
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

// Assessment Service Routes
app.use(
  '/api/v1/exams',
  createServiceProxy(process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:3004', {
    '^/api/v1/exams': '/api/v1/exams',
  })
);

app.use(
  '/api/v1/results',
  createServiceProxy(process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:3004', {
    '^/api/v1/results': '/api/v1/results',
  })
);

app.use(
  '/api/v1/report-cards',
  createServiceProxy(process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:3004', {
    '^/api/v1/report-cards': '/api/v1/report-cards',
  })
);

// Fee Service Routes
app.use(
  '/api/v1/fee-structures',
  createServiceProxy(process.env.FEE_SERVICE_URL || 'http://localhost:3005', {
    '^/api/v1/fee-structures': '/api/v1/fee-structures',
  })
);

app.use(
  '/api/v1/payments',
  createServiceProxy(process.env.FEE_SERVICE_URL || 'http://localhost:3005', {
    '^/api/v1/payments': '/api/v1/payments',
  })
);

app.use(
  '/api/v1/fee-waivers',
  createServiceProxy(process.env.FEE_SERVICE_URL || 'http://localhost:3005', {
    '^/api/v1/fee-waivers': '/api/v1/fee-waivers',
  })
);

// Attendance Service Routes
app.use(
  '/api/v1/attendances',
  createServiceProxy(process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3006', {
    '^/api/v1/attendances': '/api/v1/attendances',
  })
);

app.use(
  '/api/v1/attendance-summaries',
  createServiceProxy(process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3006', {
    '^/api/v1/attendance-summaries': '/api/v1/attendance-summaries',
  })
);

app.use(
  '/api/v1/leaves',
  createServiceProxy(process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3006', {
    '^/api/v1/leaves': '/api/v1/leaves',
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
  console.log(`  - Assessment Service: ${process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:3004'}`);
  console.log(`  - Fee Service: ${process.env.FEE_SERVICE_URL || 'http://localhost:3005'}`);
  console.log(`  - Attendance Service: ${process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3006'}`);
});

export default app;
