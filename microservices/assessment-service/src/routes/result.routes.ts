import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { resultController } from '../controllers/result.controller';

const router = Router();

router.use(authenticate);

router.get('/', resultController.getAll);
router.get('/:id', resultController.getById);
router.post('/', authorize('ADMIN', 'TEACHER'), resultController.create);
router.post('/bulk', authorize('ADMIN', 'TEACHER'), resultController.bulkCreate);
router.put('/:id', authorize('ADMIN', 'TEACHER'), resultController.update);

export default router;
