import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
// Admission routes will be implemented here

const router = Router();

router.use(authenticate);

// router.get('/', admissionController.getAll);
// router.post('/', admissionController.create);

export default router;
