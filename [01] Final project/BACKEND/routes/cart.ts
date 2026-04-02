import { Router } from 'express'
import cartController from '../controllers/cartController'
import checkAuthentication from '../middlewares/auth'

const router = Router()

router.use(checkAuthentication)

router.get('/', cartController.getMyCart)
router.post('/', cartController.addToCart)
router.patch('/:id', cartController.updateCartItem)
router.delete('/:id', cartController.removeCartItem)
router.delete('/', cartController.clearCart)

export default router