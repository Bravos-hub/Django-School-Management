import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { attendanceController } from '../controllers/attendance.controller';

const router = Router();

router.use(authenticate);

router.get('/', attendanceController.getAll);
router.post('/', authorize('ADMIN', 'TEACHER'), attendanceController.mark);
router.post('/bulk', authorize('ADMIN', 'TEACHER'), attendanceController.bulkMark);

export default router;
