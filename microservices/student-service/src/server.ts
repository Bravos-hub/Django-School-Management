import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { logger } from './utils/logger';
import studentRoutes from './routes/student.routes';
import admissionRoutes from './routes/admission.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.get('/health', (req, res) => {
  res.status(200).json({
    service: process.env.SERVICE_NAME || 'student-service',
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/admissions', admissionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Student Service running on port ${PORT}`);
});

export default app;
