import { NextFunction, Request, Response } from 'express'
import authService from '../services/authService'

const authController = {
    signup: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await authService.signup(req.body)

            return res.status(201).json({
                message: 'Account created successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await authService.login(req.body)

            return res.status(200).json({
                message: 'Login successful',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    getUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.status(200).json({
                data: req.user,
            })
        } catch (error) {
            return next(error)
        }
    },
}

export default authController