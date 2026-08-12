import { z } from 'zod'
import Cart from '../models/Cart'
import Product from '../models/Product'
import { CartItem } from '../models'

const addToCartSchema = z.object({
    productId: z.coerce.number().int().positive('Product id is required'),
    quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
})

const updateCartItemSchema = z.object({
    quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
})

const cartService = {
    getMyCart: async (userId: number | string) => {
        let cart = await Cart.findOne({
            where: { userId },
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                    ],
                },
            ],
            order: [[{ model: CartItem, as: 'items' }, 'createdAt', 'DESC']],
        })

        if (!cart) {
            cart = await Cart.create({ userId })

            cart = await Cart.findOne({
                where: { userId },
                include: [
                    {
                        model: CartItem,
                        as: 'items',
                        include: [
                            {
                                model: Product,
                                as: 'product',
                            },
                        ],
                    },
                ],
            })
        }

        return cart
    },

    addToCart: async (userId: number | string, body: unknown) => {
        const result = addToCartSchema.safeParse(body)

        if (!result.success) {
            const error = new Error('Validation failed')
            ;(error as any).statusCode = 400
            ;(error as any).errors = z.flattenError(result.error).fieldErrors
            throw error
        }

        const { productId, quantity } = result.data

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

        if (productData.stock < quantity) {
            const error = new Error('Not enough stock available')
            ;(error as any).statusCode = 400
            throw error
        }

        if (String(productData.sellerId) === String(userId)) {
            const error = new Error('You cannot add your own product to cart')
            ;(error as any).statusCode = 403
            throw error
        }

        let cart = await Cart.findOne({
            where: { userId },
        })

        if (!cart) {
            cart = await Cart.create({ userId })
        }

        const cartData = cart.toJSON() as any

        const existingItem = await CartItem.findOne({
            where: {
                cartId: cartData.id,
                productId,
            },
        })

        if (existingItem) {
            const existingItemData = existingItem.toJSON() as any
            const newQuantity = existingItemData.quantity + quantity

            if (newQuantity > productData.stock) {
                const error = new Error('Requested quantity exceeds stock')
                ;(error as any).statusCode = 400
                throw error
            }

            await CartItem.update(
                { quantity: newQuantity },
                {
                    where: {
                        id: existingItemData.id,
                    },
                }
            )
        } else {
            await CartItem.create({
                cartId: cartData.id,
                productId,
                quantity,
            })
        }

        return await cartService.getMyCart(userId)
    },

    updateCartItem: async (
        userId: number | string,
        cartItemId: string,
        body: unknown
    ) => {
        const result = updateCartItemSchema.safeParse(body)

        if (!result.success) {
            const error = new Error('Validation failed')
            ;(error as any).statusCode = 400
            ;(error as any).errors = z.flattenError(result.error).fieldErrors
            throw error
        }

        const { quantity } = result.data

        const cart = await Cart.findOne({
            where: { userId },
        })

        if (!cart) {
            const error = new Error('Cart not found')
            ;(error as any).statusCode = 404
            throw error
        }

        const cartData = cart.toJSON() as any

        const cartItem = await CartItem.findOne({
            where: {
                id: cartItemId,
                cartId: cartData.id,
            },
        })

        if (!cartItem) {
            const error = new Error('Cart item not found')
            ;(error as any).statusCode = 404
            throw error
        }

        const cartItemData = cartItem.toJSON() as any

        const product = await Product.findByPk(cartItemData.productId)

        if (!product) {
            const error = new Error('Product not found')
            ;(error as any).statusCode = 404
            throw error
        }

        const productData = product.toJSON() as any

        if (quantity > productData.stock) {
            const error = new Error('Requested quantity exceeds stock')
            ;(error as any).statusCode = 400
            throw error
        }

        await CartItem.update(
            { quantity },
            {
                where: { id: cartItemId },
            }
        )

        return await cartService.getMyCart(userId)
    },

    removeCartItem: async (userId: number | string, cartItemId: string) => {
        const cart = await Cart.findOne({
            where: { userId },
        })

        if (!cart) {
            const error = new Error('Cart not found')
            ;(error as any).statusCode = 404
            throw error
        }

        const cartData = cart.toJSON() as any

        const cartItem = await CartItem.findOne({
            where: {
                id: cartItemId,
                cartId: cartData.id,
            },
        })

        if (!cartItem) {
            const error = new Error('Cart item not found')
            ;(error as any).statusCode = 404
            throw error
        }

        await CartItem.destroy({
            where: { id: cartItemId },
        })

        return await cartService.getMyCart(userId)
    },

    clearCart: async (userId: number | string) => {
        const cart = await Cart.findOne({
            where: { userId },
        })

        if (!cart) {
            return true
        }

        const cartData = cart.toJSON() as any

        await CartItem.destroy({
            where: {
                cartId: cartData.id,
            },
        })

        return true
    },
}

export default cartService