import { Router } from 'express';
import ProductRoutes from './product';
import OrderRoutes from './order';

const router = Router();
router.use('/products', ProductRoutes);
router.use('/orders', OrderRoutes);

export default router;
