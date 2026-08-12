import { Router } from 'express'
import ProductRoutes from './product'
import OrderRoutes from './order'
import DashboardRoutes from './dashboard'

const router = Router()

router.use('/dashboard', DashboardRoutes)
router.use('/products', ProductRoutes)
router.use('/orders', OrderRoutes)

export default router