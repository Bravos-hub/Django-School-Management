import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
// Leave routes will be implemented here

const router = Router();

router.use(authenticate);

// router.get('/', leaveController.getAll);
// router.post('/', leaveController.create);
// router.patch('/:id/approve', authorize('ADMIN', 'TEACHER'), leaveController.approve);

export default router;
