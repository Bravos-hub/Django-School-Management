import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { summaryController } from '../controllers/summary.controller';

const router = Router();

router.use(authenticate);

router.get('/student/:studentId', summaryController.getByStudent);
router.post('/generate', summaryController.generate);

export default router;
