import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
// User routes will be added here
// import { userController } from '../controllers/user.controller';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Example: Get all users (admin only)
// router.get('/', authorize('ADMIN'), userController.getAllUsers);

export default router;
