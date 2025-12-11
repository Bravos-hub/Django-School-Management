import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { paymentController } from '../controllers/payment.controller';

const router = Router();

router.use(authenticate);

router.get('/', paymentController.getAll);
router.get('/:id', paymentController.getById);
router.post('/', paymentController.create);
router.patch('/:id/status', authorize('ADMIN'), paymentController.updateStatus);

export default router;
