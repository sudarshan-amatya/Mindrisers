import { Router } from 'express'
import authRoutes from './auth'
import sellerRoutes from './seller'
import productRoutes from './product'
import userRoute from './userRoute'
import cartRoutes from './cart'
import orderRoutes from './orders'
import categoryRoutes from './category'
import wishlistRoutes from './wishlist'
import adminRoutes from './admin'
import checkAuthentication, {
    checkSeller,
    checkAdmin,
} from '../middlewares/auth'

const router = Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)
router.use('/wishlist', wishlistRoutes)
router.use('/users', userRoute)
router.use('/seller', checkAuthentication, checkSeller, sellerRoutes)
router.use('/admin', checkAuthentication, checkAdmin, adminRoutes)

export default router