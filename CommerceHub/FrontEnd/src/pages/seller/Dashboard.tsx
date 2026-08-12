import { useEffect, useState } from 'react'
import {
    BadgeDollarSign,
    Package,
    Plus,
    ShoppingBag,
    AlertTriangle,
    Eye,
    Box,
} from 'lucide-react'
import { Link } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify'

type ProductType = {
    id: number | string
    title: string
    slug: string
    stock: number
    price: number
    discountPrice?: number | null
    status: 'active' | 'inactive'
    thumbnail?: string | null
    createdAt?: string
}

type OrderType = {
    id: number | string
    orderId: number | string
    quantity: number
    price: number
    order: {
        id: number | string
        status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
        paymentMethod: string
        createdAt?: string
    }
    product: {
        id: number | string
        title: string
    }
}

type DashboardResponse = {
    stats: {
        totalProducts: number
        totalOrders: number
        totalSales: number
        lowStockCount: number
    }
    lowStockProducts: ProductType[]
    recentProducts: ProductType[]
    recentOrders: OrderType[]
}

function SellerDashboard() {
    const [loading, setLoading] = useState(true)
    const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)

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
                    'http://localhost:3000/api/seller/dashboard',
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
                        'Failed to fetch dashboard'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchDashboard()
    }, [])

    const stats = [
        {
            title: 'Total Sales',
            value: `$${dashboard?.stats.totalSales?.toFixed(2) || '0.00'}`,
            icon: BadgeDollarSign,
            note: 'Total completed sales',
        },
        {
            title: 'Total Orders',
            value: String(dashboard?.stats.totalOrders || 0),
            icon: ShoppingBag,
            note: 'Orders received',
        },
        {
            title: 'Products',
            value: String(dashboard?.stats.totalProducts || 0),
            icon: Package,
            note: `${dashboard?.stats.lowStockCount || 0} low in stock`,
        },
        {
            title: 'Low Stock',
            value: String(dashboard?.stats.lowStockCount || 0),
            icon: AlertTriangle,
            note: 'Need restocking soon',
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
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] font-bold text-[#151875]">
                            Seller Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-[#8A8FB9]">
                            Manage your store, products, and orders from one
                            place.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/seller/products"
                            className="inline-flex items-center gap-2 rounded-md border border-[#E5E7F2] bg-white px-4 py-2 text-sm font-medium text-[#151875] transition hover:border-pink-500 hover:text-pink-600"
                        >
                            <Box size={18} />
                            Manage Products
                        </Link>

                        <Link
                            to="/seller/products/create"
                            className="inline-flex items-center gap-2 rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700"
                        >
                            <Plus size={18} />
                            Add Product
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => {
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
                                        <p className="mt-2 text-xs text-slate-500">
                                            {item.note}
                                        </p>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                                        <Icon size={22} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                    <div className="space-y-6">
                        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-[#151875]">
                                        Recent Products
                                    </h3>
                                    <p className="mt-1 text-sm text-[#8A8FB9]">
                                        Recently added or updated items
                                    </p>
                                </div>

                                <Link
                                    to="/seller/products"
                                    className="text-sm font-medium text-pink-600 transition hover:text-pink-700"
                                >
                                    View All
                                </Link>
                            </div>

                            {dashboard?.recentProducts?.length ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-sm text-[#8A8FB9]">
                                                <th className="pb-3 font-medium">
                                                    Product
                                                </th>
                                                <th className="pb-3 font-medium">
                                                    Stock
                                                </th>
                                                <th className="pb-3 font-medium">
                                                    Price
                                                </th>
                                                <th className="pb-3 font-medium">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {dashboard.recentProducts.map(
                                                (product) => (
                                                    <tr
                                                        key={product.id}
                                                        className="border-b border-slate-50 last:border-0"
                                                    >
                                                        <td className="py-4 text-sm font-medium text-[#151875]">
                                                            {product.title}
                                                        </td>
                                                        <td className="py-4 text-sm text-slate-600">
                                                            {product.stock}
                                                        </td>
                                                        <td className="py-4 text-sm text-slate-600">
                                                            $
                                                            {product.discountPrice ??
                                                                product.price}
                                                        </td>
                                                        <td className="py-4">
                                                            <span
                                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                                    product.status ===
                                                                    'active'
                                                                        ? 'bg-green-50 text-green-600'
                                                                        : 'bg-slate-100 text-slate-600'
                                                                }`}
                                                            >
                                                                {product.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-[#8A8FB9]">
                                    No products yet.
                                </p>
                            )}
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-[#151875]">
                                        Recent Orders
                                    </h3>
                                    <p className="mt-1 text-sm text-[#8A8FB9]">
                                        Latest order activity
                                    </p>
                                </div>

                                <Link
                                    to="/seller/orders"
                                    className="text-sm font-medium text-pink-600 transition hover:text-pink-700"
                                >
                                    View All
                                </Link>
                            </div>

                            {dashboard?.recentOrders?.length ? (
                                <div className="space-y-4">
                                    {dashboard.recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="rounded-lg bg-[#F8F9FD] p-4"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-[#151875]">
                                                        Order #{order.order?.id}
                                                    </h4>
                                                    <p className="mt-1 text-sm text-slate-600">
                                                        {order.product?.title}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Qty: {order.quantity} × $
                                                        {order.price}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        order.order?.status ===
                                                        'delivered'
                                                            ? 'bg-green-50 text-green-600'
                                                            : order.order
                                                                    ?.status ===
                                                                'pending'
                                                              ? 'bg-amber-50 text-amber-600'
                                                              : order.order
                                                                      ?.status ===
                                                                  'shipped'
                                                                ? 'bg-blue-50 text-blue-600'
                                                                : 'bg-slate-100 text-slate-600'
                                                    }`}
                                                >
                                                    {order.order?.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-[#8A8FB9]">
                                    No recent orders yet.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                            <h3 className="text-lg font-semibold text-[#151875]">
                                Quick Actions
                            </h3>
                            <p className="mt-1 text-sm text-[#8A8FB9]">
                                Shortcuts for common seller tasks
                            </p>

                            <div className="mt-5 space-y-3">
                                <Link
                                    to="/seller/products/create"
                                    className="flex items-center justify-between rounded-lg bg-[#F8F9FD] px-4 py-3 text-sm font-medium text-[#151875] transition hover:bg-pink-50 hover:text-pink-600"
                                >
                                    <span className="flex items-center gap-2">
                                        <Plus size={18} />
                                        Add New Product
                                    </span>
                                    <span>→</span>
                                </Link>

                                <Link
                                    to="/seller/orders"
                                    className="flex items-center justify-between rounded-lg bg-[#F8F9FD] px-4 py-3 text-sm font-medium text-[#151875] transition hover:bg-pink-50 hover:text-pink-600"
                                >
                                    <span className="flex items-center gap-2">
                                        <ShoppingBag size={18} />
                                        View Orders
                                    </span>
                                    <span>→</span>
                                </Link>

                                <Link
                                    to="/seller/products"
                                    className="flex items-center justify-between rounded-lg bg-[#F8F9FD] px-4 py-3 text-sm font-medium text-[#151875] transition hover:bg-pink-50 hover:text-pink-600"
                                >
                                    <span className="flex items-center gap-2">
                                        <Eye size={18} />
                                        Browse My Products
                                    </span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-xl bg-gradient-to-r from-pink-600 to-[#7E33E0] p-5 text-white shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Inventory Alert
                                    </h3>
                                    <p className="mt-2 text-sm text-white/85">
                                        {dashboard?.stats.lowStockCount || 0}{' '}
                                        products are running low on stock.
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/15">
                                    <Package size={22} />
                                </div>
                            </div>

                            <div className="mt-5 space-y-2">
                                {dashboard?.lowStockProducts?.length ? (
                                    dashboard.lowStockProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm"
                                        >
                                            <span className="truncate pr-3">
                                                {product.title}
                                            </span>
                                            <span>{product.stock} left</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-white/85">
                                        No low stock products right now.
                                    </p>
                                )}
                            </div>

                            <Link
                                to="/seller/products"
                                className="mt-5 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#7E33E0] transition hover:bg-slate-100"
                            >
                                Manage Inventory
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SellerDashboard