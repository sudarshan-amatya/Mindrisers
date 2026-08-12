import { Router } from 'express'
import adminUserController from '../../controllers/adminUserController'

const router = Router()

router.get('/', adminUserController.getAllUsers)
router.get('/seller-requests', adminUserController.getSellerRequests)
router.patch('/:id/seller-request', adminUserController.updateSellerRequest)

export default router