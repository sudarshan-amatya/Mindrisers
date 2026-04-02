import { z } from 'zod'
import Cart from '../models/Cart'
import Product from '../models/Product'
import Order from '../models/Order'
import OrderItem from '../models/OrderItem'
import { CartItem } from '../models'

const checkoutSchema = z.object({
    shippingAddress: z
        .string()
        .trim()
        .min(5, 'Shipping address is required'),
    paymentMethod: z.string().trim().min(2).default('cash_on_delivery'),
})

const updateOrderStatusSchema = z.object({
    status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
})

const orderService = {
    checkout: async (userId: number | string, body: unknown) => {
        const result = checkoutSchema.safeParse(body)

        if (!result.success) {
            const error = new Error('Validation failed')
            ;(error as any).statusCode = 400
            ;(error as any).errors = z.flattenError(result.error).fieldErrors
            throw error
        }

        const { shippingAddress, paymentMethod } = result.data

        const cart = await Cart.findOne({
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

        if (!cart) {
            const error = new Error('Cart not found')
            ;(error as any).statusCode = 404
            throw error
        }

        const cartData = cart.toJSON() as any

        if (!cartData.items || cartData.items.length === 0) {
            const error = new Error('Cart is empty')
            ;(error as any).statusCode = 400
            throw error
        }

        let totalAmount = 0

        for (const item of cartData.items) {
            const product = item.product

            if (!product) {
                const error = new Error('Product not found in cart')
                ;(error as any).statusCode = 404
                throw error
            }

            if (product.status !== 'active') {
                const error = new Error(`Product "${product.title}" is not available`)
                ;(error as any).statusCode = 400
                throw error
            }

            if (String(product.sellerId) === String(userId)) {
                const error = new Error('You cannot buy your own product')
                ;(error as any).statusCode = 403
                throw error
            }

            if (item.quantity > product.stock) {
                const error = new Error(
                    `Not enough stock for "${product.title}"`
                )
                ;(error as any).statusCode = 400
                throw error
            }

            const price = product.discountPrice ?? product.price
            totalAmount += price * item.quantity
        }

        const order = await Order.create({
            userId,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentStatus: 'pending',
            status: 'pending',
        })

        const orderData = order.toJSON() as any

        for (const item of cartData.items) {
            const product = item.product
            const price = product.discountPrice ?? product.price

            await OrderItem.create({
                orderId: orderData.id,
                productId: product.id,
                sellerId: product.sellerId,
                quantity: item.quantity,
                price,
            })

            await Product.update(
                {
                    stock: product.stock - item.quantity,
                },
                {
                    where: { id: product.id },
                }
            )
        }

        await CartItem.destroy({
            where: { cartId: cartData.id },
        })

        return await Order.findOne({
            where: { id: orderData.id },
            include: [
                {
                    model: OrderItem,
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
    },

    getMyOrders: async (userId: number | string) => {
        return await Order.findAll({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        })
    },

    getMyOrderById: async (userId: number | string, id: string) => {
        const order = await Order.findOne({
            where: {
                id,
                userId,
            },
            include: [
                {
                    model: OrderItem,
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

        if (!order) {
            const error = new Error('Order not found')
            ;(error as any).statusCode = 404
            throw error
        }

        return order
    },

    getSellerOrders: async (sellerId: number | string) => {
        return await OrderItem.findAll({
            where: { sellerId },
            include: [
                {
                    model: Order,
                    as: 'order',
                },
                {
                    model: Product,
                    as: 'product',
                },
            ],
            order: [['createdAt', 'DESC']],
        })
    },

    updateSellerOrderStatus: async (
        sellerId: number | string,
        orderId: string,
        body: unknown
    ) => {
        const result = updateOrderStatusSchema.safeParse(body)

        if (!result.success) {
            const error = new Error('Validation failed')
            ;(error as any).statusCode = 400
            ;(error as any).errors = z.flattenError(result.error).fieldErrors
            throw error
        }

        const { status } = result.data

        const sellerOrderItem = await OrderItem.findOne({
            where: {
                orderId,
                sellerId,
            },
        })

        if (!sellerOrderItem) {
            const error = new Error('Order not found for this seller')
            ;(error as any).statusCode = 404
            throw error
        }

        await Order.update(
            { status },
            {
                where: { id: orderId },
            }
        )

        return await Order.findByPk(orderId, {
            include: [
                {
                    model: OrderItem,
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
    },
}

export default orderService