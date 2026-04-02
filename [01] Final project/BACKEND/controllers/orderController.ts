import { NextFunction, Request, Response } from 'express'
import orderService from '../services/orderService'

type OrderParams = {
    id: string
}

const orderController = {
    checkout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    message: 'Unauthorized',
                })
            }

            const data = await orderService.checkout(req.user.id, req.body)

            return res.status(201).json({
                message: 'Order placed successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    getMyOrders: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    message: 'Unauthorized',
                })
            }

            const data = await orderService.getMyOrders(req.user.id)

            return res.status(200).json({
                message: 'Orders fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    getMyOrderById: async (
        req: Request<OrderParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    message: 'Unauthorized',
                })
            }

            const data = await orderService.getMyOrderById(
                req.user.id,
                req.params.id
            )

            return res.status(200).json({
                message: 'Order fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    getSellerOrders: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    message: 'Unauthorized',
                })
            }

            const data = await orderService.getSellerOrders(req.user.id)

            return res.status(200).json({
                message: 'Seller orders fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    updateSellerOrderStatus: async (
        req: Request<OrderParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    message: 'Unauthorized',
                })
            }

            const data = await orderService.updateSellerOrderStatus(
                req.user.id,
                req.params.id,
                req.body
            )

            return res.status(200).json({
                message: 'Order status updated successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },
}

export default orderController