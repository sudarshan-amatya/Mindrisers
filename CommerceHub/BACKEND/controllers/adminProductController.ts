import { NextFunction, Request, Response } from 'express'
import adminProductService from '../services/adminProductService'

type ProductParams = {
    id: string
}

const adminProductController = {
    getAllProducts: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = await adminProductService.getAllProducts()

            return res.status(200).json({
                message: 'Admin products fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    deleteProduct: async (
        req: Request<ProductParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await adminProductService.deleteProduct(req.params.id)

            return res.status(200).json({
                message: 'Product deleted successfully',
            })
        } catch (error) {
            return next(error)
        }
    },
}

export default adminProductController