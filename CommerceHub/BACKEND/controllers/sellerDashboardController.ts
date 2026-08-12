import { NextFunction, Request, Response } from 'express'
import sellerDashboardService from '../services/sellerDashboardService'

const sellerDashboardController = {
    getDashboardStats: async (
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

            const data = await sellerDashboardService.getDashboardStats(
                req.user.id
            )

            return res.status(200).json({
                message: 'Seller dashboard fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },
}

export default sellerDashboardController