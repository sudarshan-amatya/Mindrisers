import { NextFunction, Request, Response } from 'express'
import adminOrderService from '../services/adminOrderService'

type OrderParams = {
    id: string
}

const adminOrderController = {
    getAllOrders: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = await adminOrderService.getAllOrders()

            return res.status(200).json({
                message: 'Admin orders fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    getOrderById: async (
        req: Request<OrderParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = await adminOrderService.getOrderById(req.params.id)

            return res.status(200).json({
                message: 'Admin order fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },
}

export default adminOrderController