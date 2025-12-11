import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { subjectController } from '../controllers/subject.controller';

const router = Router();

router.use(authenticate);

router.get('/', subjectController.getAll);
router.get('/:id', subjectController.getById);
router.post('/', subjectController.create);

export default router;
