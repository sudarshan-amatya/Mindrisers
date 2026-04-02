import { Router } from 'express'
import userController from '../controllers/userController'
import checkAuthentication from '../middlewares/auth'

const router = Router()

router.use(checkAuthentication)

router.get('/profile', userController.getProfile)
router.patch('/profile', userController.updateProfile)
router.post('/request-seller', userController.requestSellerAccess)

export default router