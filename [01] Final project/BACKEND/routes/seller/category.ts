import { Router } from 'express'
import categoryController from '../../controllers/categoryControllers'

const router = Router()

router.post('/', categoryController.createCategory)

export default router