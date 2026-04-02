import { Router } from 'express'
import categoryRoutes from './category'
import userRoutes from './user'
import productRoutes from './products'
import dashboardRoutes from './dashboard'
import orderRoutes from './order'

const router = Router()

router.use('/dashboard', dashboardRoutes)
router.use('/categories', categoryRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/orders', orderRoutes)

export default router