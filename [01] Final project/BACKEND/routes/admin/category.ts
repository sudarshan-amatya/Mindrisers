import { Router } from 'express'
import categoryController from '../../controllers/categoryControllers'

const router = Router()

router.get('/', categoryController.getAllAdminCategories)
router.get('/:id', categoryController.getCategoryById)
router.post('/', categoryController.createCategory)
router.patch('/:id', categoryController.updateCategory)
router.delete('/:id', categoryController.deleteCategory)

export default router