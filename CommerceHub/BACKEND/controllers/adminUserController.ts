import { NextFunction, Request, Response } from 'express'
import adminUserService from '../services/adminUserSeller'

type UserParams = {
    id: string
}

const adminUserController = {
    getSellerRequests: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = await adminUserService.getSellerRequests()

            return res.status(200).json({
                message: 'Seller requests fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await adminUserService.getAllUsers()

            return res.status(200).json({
                message: 'Users fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    updateSellerRequest: async (
        req: Request<UserParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = await adminUserService.updateSellerRequest(
                req.params.id,
                req.body
            )

            return res.status(200).json({
                message: 'Seller request updated successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },
}

export default adminUserController