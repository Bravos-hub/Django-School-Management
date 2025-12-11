import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { feeStructureController } from '../controllers/fee-structure.controller';

const router = Router();

router.use(authenticate);

router.get('/', feeStructureController.getAll);
router.get('/:id', feeStructureController.getById);
router.post('/', authorize('ADMIN'), feeStructureController.create);

export default router;
