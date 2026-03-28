import { Router } from 'express';
import authRoutes from './auth';
import sellerRoutes from './seller';
import productRoutes from './product';
import checkAuthentication, { checkSeller } from '../middlewares/auth';

const router = Router();
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/seller', checkAuthentication,checkSeller, sellerRoutes);

export default router;
