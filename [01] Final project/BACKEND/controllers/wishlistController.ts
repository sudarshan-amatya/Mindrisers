import { NextFunction, Request, Response } from 'express'
import wishlistService from '../services/wishlistService'

type WishlistParams = {
    id: string
}

const wishlistController = {
    getMyWishlist: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    message: 'Unauthorized',
                })
            }

            const data = await wishlistService.getMyWishlist(req.user.id)

            return res.status(200).json({
                message: 'Wishlist fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    addToWishlist: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    message: 'Unauthorized',
                })
            }

            const data = await wishlistService.addToWishlist(
                req.user.id,
                req.body
            )

            return res.status(200).json({
                message: 'Product added to wishlist successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    removeFromWishlist: async (
        req: Request<WishlistParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    message: 'Unauthorized',
                })
            }

            const data = await wishlistService.removeFromWishlist(
                req.user.id,
                req.params.id
            )

            return res.status(200).json({
                message: 'Wishlist item removed successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    toggleWishlist: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    message: 'Unauthorized',
                })
            }

            const data = await wishlistService.toggleWishlist(
                req.user.id,
                req.body
            )

            return res.status(200).json({
                message: data.added
                    ? 'Product added to wishlist successfully'
                    : 'Product removed from wishlist successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },
}

export default wishlistController