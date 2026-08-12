import Product from '../models/Product'
import OrderItem from '../models/OrderItem'
import Order from '../models/Order'
import { Op } from 'sequelize'

const sellerDashboardService = {
    getDashboardStats: async (sellerId: number | string) => {
        const totalProducts = await Product.count({
            where: { sellerId },
        })

        const totalOrders = await OrderItem.count({
            where: { sellerId },
        })

        const sellerOrderItems = await OrderItem.findAll({
            where: { sellerId },
            include: [
                {
                    model: Order,
                    as: 'order',
                },
            ],
        })

        const totalSales = sellerOrderItems.reduce((sum, item: any) => {
            if (item.order?.status === 'cancelled') return sum
            return sum + item.price * item.quantity
        }, 0)

        const lowStockProducts = await Product.findAll({
            where: {
                sellerId,
                stock: {
                    [Op.lte]: 5,
                },
            },
            order: [['stock', 'ASC']],
            limit: 5,
        })

        const recentProducts = await Product.findAll({
            where: { sellerId },
            order: [['createdAt', 'DESC']],
            limit: 5,
        })

        const recentOrders = await OrderItem.findAll({
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
            limit: 5,
        })

        return {
            stats: {
                totalProducts,
                totalOrders,
                totalSales,
                lowStockCount: lowStockProducts.length,
            },
            lowStockProducts,
            recentProducts,
            recentOrders,
        }
    },
}

export default sellerDashboardService