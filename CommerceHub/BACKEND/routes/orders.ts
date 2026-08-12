import { Router } from 'express'
import orderController from '../controllers/orderController'
import checkAuthentication from '../middlewares/auth'

const router = Router()

router.use(checkAuthentication)

router.post('/checkout', orderController.checkout)
router.get('/my-orders', orderController.getMyOrders)
router.get('/my-orders/:id', orderController.getMyOrderById)

export default router