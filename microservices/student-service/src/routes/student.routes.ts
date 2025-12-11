import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { studentController } from '../controllers/student.controller';

const router = Router();

router.use(authenticate);

router.get('/', studentController.getAll);
router.get('/:id', studentController.getById);
router.post('/', studentController.create);
router.put('/:id', studentController.update);
router.delete('/:id', studentController.delete);

export default router;
