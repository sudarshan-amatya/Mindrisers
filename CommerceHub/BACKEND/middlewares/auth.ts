import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface AuthUser extends JwtPayload {
    id: number | string
    firstName: string
    lastName: string
    email: string
    isSeller: boolean
    isAdmin: boolean
    sellerRequestStatus?: 'none' | 'pending' | 'approved' | 'rejected'
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser
        }
    }
}

export default function checkAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({
                message: 'Authorization header missing',
            })
        }

        const [scheme, token] = authHeader.split(' ')

        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({
                message: 'Invalid authorization format',
            })
        }

        const secret = process.env.JWT_SECRETKEY

        if (!secret) {
            return res.status(500).json({
                message: 'JWT secret is not configured',
            })
        }

        const decoded = jwt.verify(token, secret)

        if (typeof decoded === 'string') {
            return res.status(401).json({
                message: 'Invalid token payload',
            })
        }

        req.user = decoded as AuthUser

        return next()
    } catch (error) {
        return next(error)
    }
}

export function checkSeller(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({
            message: 'Unauthorized',
        })
    }

    if (!req.user.isSeller) {
        return res.status(403).json({
            message: 'Access denied. Seller only.',
        })
    }

    return next()
}

export function checkAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({
            message: 'Unauthorized',
        })
    }

    if (!req.user.isAdmin) {
        return res.status(403).json({
            message: 'Access denied. Admin only.',
        })
    }

    return next()
}