import { Router } from 'express'
import productController from '../../controllers/productController'
import upload from '../../middlewares/upload'

const router = Router()

router.get('/', productController.getSellerProducts)
router.get('/:id', productController.getSellerProductById)

router.post(
    '/',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
    ]),
    productController.createProduct
)

router.patch(
    '/:id',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
    ]),
    productController.updateProduct
)

router.delete('/:id', productController.deleteProduct)

export default router