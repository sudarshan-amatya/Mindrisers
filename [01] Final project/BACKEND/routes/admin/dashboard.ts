import { Router } from 'express'
import adminDashboardController from '../../controllers/adminDashboardController'

const router = Router()

router.get('/', adminDashboardController.getDashboardStats)

export default router