import { Router } from 'express'
import wishlistController from '../controllers/wishlistController'
import checkAuthentication from '../middlewares/auth'

const router = Router()

router.use(checkAuthentication)

router.get('/', wishlistController.getMyWishlist)
router.post('/', wishlistController.addToWishlist)
router.post('/toggle', wishlistController.toggleWishlist)
router.delete('/:id', wishlistController.removeFromWishlist)

export default router