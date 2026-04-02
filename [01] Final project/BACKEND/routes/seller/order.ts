import { Router } from 'express'
import orderController from '../../controllers/orderController'

const router = Router()

router.get('/', orderController.getSellerOrders)
router.patch('/:id/status', orderController.updateSellerOrderStatus)

export default router