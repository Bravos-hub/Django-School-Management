import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { logger } from './utils/logger';
import feeStructureRoutes from './routes/fee-structure.routes';
import paymentRoutes from './routes/payment.routes';
import feeWaiverRoutes from './routes/fee-waiver.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3005;

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
    service: process.env.SERVICE_NAME || 'fee-service',
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/v1/fee-structures', feeStructureRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/fee-waivers', feeWaiverRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Fee Service running on port ${PORT}`);
});

export default app;
