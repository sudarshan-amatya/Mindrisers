import { NextFunction, Request, Response } from 'express'
import adminDashboardService from '../services/adminDashboardService'

const adminDashboardController = {
    getDashboardStats: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = await adminDashboardService.getDashboardStats()

            return res.status(200).json({
                message: 'Admin dashboard fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },
}

export default adminDashboardController