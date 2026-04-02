import { Router } from 'express'
import sellerDashboardController from '../../controllers/sellerDashboardController'

const router = Router()

router.get('/', sellerDashboardController.getDashboardStats)

export default router