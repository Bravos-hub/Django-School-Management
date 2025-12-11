import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
// Academic year routes will be implemented here

const router = Router();

router.use(authenticate);

// router.get('/', academicYearController.getAll);
// router.post('/', academicYearController.create);

export default router;
