import Order from '../models/Order'
import OrderItem from '../models/OrderItem'
import Product from '../models/Product'

const adminOrderService = {
    getAllOrders: async () => {
        return await Order.findAll({
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

    getOrderById: async (id: string) => {
        const order = await Order.findByPk(id, {
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
}

export default adminOrderService