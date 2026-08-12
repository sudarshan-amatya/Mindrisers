import { Router } from 'express'
import adminOrderController from '../../controllers/adminOrderController'

const router = Router()

router.get('/', adminOrderController.getAllOrders)
router.get('/:id', adminOrderController.getOrderById)

export default router