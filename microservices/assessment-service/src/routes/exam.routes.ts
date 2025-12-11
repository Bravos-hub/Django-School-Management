import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { examController } from '../controllers/exam.controller';

const router = Router();

router.use(authenticate);

router.get('/', examController.getAll);
router.get('/:id', examController.getById);
router.post('/', authorize('ADMIN', 'TEACHER'), examController.create);
router.put('/:id', authorize('ADMIN', 'TEACHER'), examController.update);
router.delete('/:id', authorize('ADMIN'), examController.delete);

export default router;
