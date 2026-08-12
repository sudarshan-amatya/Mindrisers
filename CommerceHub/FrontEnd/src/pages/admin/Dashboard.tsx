import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
    Users,
    ShieldCheck,
    Store,
    Clock3,
    Package,
    ShoppingBag,
} from 'lucide-react'
import { Link } from 'react-router'

type DashboardData = {
    stats: {
        totalUsers: number
        totalSellers: number
        totalAdmins: number
        pendingSellerRequests: number
        totalProducts: number
        totalOrders: number
    }
    recentUsers: Array<{
        id: number | string
        firstName: string
        lastName: string
        email: string
        isSeller: boolean
        isAdmin: boolean
        sellerRequestStatus: 'none' | 'pending' | 'approved' | 'rejected'
        createdAt?: string
    }>
    recentProducts: Array<{
        id: number | string
        title: string
        category: string
        stock: number
        status: 'active' | 'inactive'
        createdAt?: string
    }>
    recentOrders: Array<{
        id: number | string
        totalAmount: number
        status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
        createdAt?: string
    }>
}

function AdminDashboard() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            const token = localStorage.getItem('accessToken')

            if (!token) {
                toast.error('Please login first')
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                const res = await axios.get(
                    'http://localhost:3000/api/admin/dashboard',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                setDashboard(res.data.data)
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message ||
                        'Failed to fetch admin dashboard'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchDashboard()
    }, [])

    const cards = [
        {
            title: 'Total Users',
            value: dashboard?.stats.totalUsers || 0,
            icon: Users,
        },
        {
            title: 'Total Sellers',
            value: dashboard?.stats.totalSellers || 0,
            icon: Store,
        },
        {
            title: 'Pending Requests',
            value: dashboard?.stats.pendingSellerRequests || 0,
            icon: Clock3,
        },
        {
            title: 'Total Products',
            value: dashboard?.stats.totalProducts || 0,
            icon: Package,
        },
        {
            title: 'Total Orders',
            value: dashboard?.stats.totalOrders || 0,
            icon: ShoppingBag,
        },
        {
            title: 'Admins',
            value: dashboard?.stats.totalAdmins || 0,
            icon: ShieldCheck,
        },
    ]

    if (loading) {
        return (
            <section className="min-h-screen bg-[#F6F7FB]">
                <div className="container py-8 md:py-10">
                    <div className="flex min-h-[60vh] items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="min-h-screen bg-[#F6F7FB]">
            <div className="container py-8 md:py-10">
                <div className="mb-8">
                    <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2.5rem)] font-bold text-[#151875]">
                        Admin Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-[#8A8FB9]">
                        Overview of users, sellers, products, and orders.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {cards.map((item) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={item.title}
                                className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-[#8A8FB9]">
                                            {item.title}
                                        </p>
                                        <h2 className="mt-2 text-2xl font-bold text-[#151875]">
                                            {item.value}
                                        </h2>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                                        <Icon size={22} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-3">
                    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#151875]">
                                Recent Users
                            </h2>
                            <Link
                                to="/admin/users"
                                className="text-sm font-medium text-pink-600 hover:text-pink-700"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {dashboard?.recentUsers?.length ? (
                                dashboard.recentUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="rounded-lg bg-[#F8F9FD] p-3"
                                    >
                                        <p className="font-medium text-[#151875]">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {user.email}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">
                                    No users found.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#151875]">
                                Recent Products
                            </h2>
                            <Link
                                to="/admin/products"
                                className="text-sm font-medium text-pink-600 hover:text-pink-700"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {dashboard?.recentProducts?.length ? (
                                dashboard.recentProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="rounded-lg bg-[#F8F9FD] p-3"
                                    >
                                        <p className="font-medium text-[#151875]">
                                            {product.title}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {product.category} • Stock: {product.stock}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">
                                    No products found.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#151875]">
                                Recent Orders
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {dashboard?.recentOrders?.length ? (
                                dashboard.recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="rounded-lg bg-[#F8F9FD] p-3"
                                    >
                                        <p className="font-medium text-[#151875]">
                                            Order #{order.id}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            ${Number(order.totalAmount).toFixed(2)} •{' '}
                                            {order.status}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">
                                    No orders found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AdminDashboard