import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', authController.refreshToken);
router.get('/me', authenticate, authController.getMe);

export default router;
