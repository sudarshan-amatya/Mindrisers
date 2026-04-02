import User from '../models/User'
import Product from '../models/Product'
import Order from '../models/Order'

const adminDashboardService = {
    getDashboardStats: async () => {
        const totalUsers = await User.count()
        const totalSellers = await User.count({
            where: {
                isSeller: true,
            },
        })
        const totalAdmins = await User.count({
            where: {
                isAdmin: true,
            },
        })
        const pendingSellerRequests = await User.count({
            where: {
                sellerRequestStatus: 'pending',
            },
        })
        const totalProducts = await Product.count()
        const totalOrders = await Order.count()

        const recentUsers = await User.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5,
            attributes: [
                'id',
                'firstName',
                'lastName',
                'email',
                'isSeller',
                'isAdmin',
                'sellerRequestStatus',
                'createdAt',
            ],
        })

        const recentProducts = await Product.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5,
        })

        const recentOrders = await Order.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5,
        })

        return {
            stats: {
                totalUsers,
                totalSellers,
                totalAdmins,
                pendingSellerRequests,
                totalProducts,
                totalOrders,
            },
            recentUsers,
            recentProducts,
            recentOrders,
        }
    },
}

export default adminDashboardService