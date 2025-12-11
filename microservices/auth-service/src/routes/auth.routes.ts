import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authController } from '../controllers/auth.controller';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for auth endpoints
const authRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10), // 5 requests per window
  message: 'Too many authentication attempts, please try again later',
});

router.post('/register', authRateLimit, authController.register);
router.post('/login', authRateLimit, authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', authController.refreshToken);
router.get('/me', authenticate, authController.getMe);

export default router;
