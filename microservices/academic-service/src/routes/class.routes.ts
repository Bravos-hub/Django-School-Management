import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { classController } from '../controllers/class.controller';

const router = Router();

router.use(authenticate);

router.get('/', classController.getAll);
router.get('/:id', classController.getById);
router.post('/', classController.create);

export default router;
