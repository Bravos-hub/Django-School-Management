import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { reportCardController } from '../controllers/report-card.controller';

const router = Router();

router.use(authenticate);

router.get('/student/:studentId', reportCardController.getByStudent);
router.post('/generate', reportCardController.generate);

export default router;
