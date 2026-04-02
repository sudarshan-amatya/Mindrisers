import { Router } from 'express'
import adminProductController from '../../controllers/adminProductController'

const router = Router()

router.get('/', adminProductController.getAllProducts)
router.delete('/:id', adminProductController.deleteProduct)

export default router