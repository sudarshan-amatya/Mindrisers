import { Router } from 'express'
import categoryController from '../controllers/categoryControllers'

const router = Router()

router.get('/', categoryController.getAllCategories)

export default router