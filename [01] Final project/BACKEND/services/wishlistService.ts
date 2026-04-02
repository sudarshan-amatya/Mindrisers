import { z } from 'zod'
import Wishlist from '../models/Wishlist'
import Product from '../models/Product'

const addWishlistSchema = z.object({
    productId: z.coerce.number().int().positive('Product id is required'),
})

const wishlistService = {
    getMyWishlist: async (userId: number | string) => {
        return await Wishlist.findAll({
            where: { userId },
            include: [
                {
                    model: Product,
                    as: 'product',
                },
            ],
            order: [['createdAt', 'DESC']],
        })
    },

    addToWishlist: async (userId: number | string, body: unknown) => {
        const result = addWishlistSchema.safeParse(body)

        if (!result.success) {
            const error = new Error('Validation failed')
            ;(error as any).statusCode = 400
            ;(error as any).errors = z.flattenError(result.error).fieldErrors
            throw error
        }

        const { productId } = result.data

        const product = await Product.findByPk(productId)

        if (!product) {
            const error = new Error('Product not found')
            ;(error as any).statusCode = 404
            throw error
        }

        const productData = product.toJSON() as any

        if (productData.status !== 'active') {
            const error = new Error('Product is not available')
            ;(error as any).statusCode = 400
            throw error
        }

        if (String(productData.sellerId) === String(userId)) {
            const error = new Error(
                'You cannot add your own product to wishlist'
            )
            ;(error as any).statusCode = 403
            throw error
        }

        const existingWishlist = await Wishlist.findOne({
            where: {
                userId,
                productId,
            },
        })

        if (existingWishlist) {
            const error = new Error('Product already in wishlist')
            ;(error as any).statusCode = 400
            throw error
        }

        await Wishlist.create({
            userId,
            productId,
        })

        return await wishlistService.getMyWishlist(userId)
    },

    removeFromWishlist: async (
        userId: number | string,
        wishlistId: string
    ) => {
        const wishlistItem = await Wishlist.findOne({
            where: {
                id: wishlistId,
                userId,
            },
        })

        if (!wishlistItem) {
            const error = new Error('Wishlist item not found')
            ;(error as any).statusCode = 404
            throw error
        }

        await Wishlist.destroy({
            where: {
                id: wishlistId,
                userId,
            },
        })

        return await wishlistService.getMyWishlist(userId)
    },

    toggleWishlist: async (userId: number | string, body: unknown) => {
        const result = addWishlistSchema.safeParse(body)

        if (!result.success) {
            const error = new Error('Validation failed')
            ;(error as any).statusCode = 400
            ;(error as any).errors = z.flattenError(result.error).fieldErrors
            throw error
        }

        const { productId } = result.data

        const product = await Product.findByPk(productId)

        if (!product) {
            const error = new Error('Product not found')
            ;(error as any).statusCode = 404
            throw error
        }

        const productData = product.toJSON() as any

        if (String(productData.sellerId) === String(userId)) {
            const error = new Error(
                'You cannot add your own product to wishlist'
            )
            ;(error as any).statusCode = 403
            throw error
        }

        const existingWishlist = await Wishlist.findOne({
            where: {
                userId,
                productId,
            },
        })

        if (existingWishlist) {
            await Wishlist.destroy({
                where: {
                    id: existingWishlist.toJSON().id,
                },
            })

            return {
                added: false,
                items: await wishlistService.getMyWishlist(userId),
            }
        }

        await Wishlist.create({
            userId,
            productId,
        })

        return {
            added: true,
            items: await wishlistService.getMyWishlist(userId),
        }
    },
}

export default wishlistService