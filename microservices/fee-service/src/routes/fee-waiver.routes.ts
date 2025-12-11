import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
// Fee waiver routes will be implemented here

const router = Router();

router.use(authenticate);

// router.get('/', feeWaiverController.getAll);
// router.post('/', authorize('ADMIN'), feeWaiverController.create);

export default router;
