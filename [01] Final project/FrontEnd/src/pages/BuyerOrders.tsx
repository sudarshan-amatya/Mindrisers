import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router'
import { ArrowLeft, PackageSearch, ShoppingBag } from 'lucide-react'

type OrderProduct = {
    id: number | string
    title: string
    slug: string
    thumbnail?: string | null
    category: string
}

type OrderItem = {
    id: number | string
    orderId: number | string
    productId: number | string
    sellerId: number | string
    quantity: number
    price: number
    product: OrderProduct
}

type OrderType = {
    id: number | string
    userId: number | string
    totalAmount: number
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
    paymentMethod: string
    paymentStatus: 'pending' | 'paid' | 'failed'
    shippingAddress: string
    createdAt?: string
    updatedAt?: string
    items: OrderItem[]
}

function BuyerOrders() {
    const [orders, setOrders] = useState<OrderType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('accessToken')

            if (!token) {
                toast.error('Please login first')
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                const res = await axios.get(
                    'http://localhost:3000/api/orders/my-orders',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                setOrders(res.data.data || [])
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message || 'Failed to fetch orders'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    const getStatusClasses = (status: OrderType['status']) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-50 text-green-600'
            case 'pending':
                return 'bg-amber-50 text-amber-600'
            case 'confirmed':
                return 'bg-blue-50 text-blue-600'
            case 'shipped':
                return 'bg-indigo-50 text-indigo-600'
            case 'cancelled':
                return 'bg-red-50 text-red-600'
            default:
                return 'bg-slate-100 text-slate-600'
        }
    }

    return (
        <section className="min-h-screen bg-[#F6F7FB]">
            <div className="container py-8 md:py-10">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2.5rem)] font-bold text-[#151875]">
                            My Orders
                        </h1>
                        <p className="mt-1 text-sm text-[#8A8FB9]">
                            Track and review all your orders.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 rounded-md border border-[#E5E7F2] bg-white px-4 py-2 text-sm font-medium text-[#151875] transition hover:border-pink-500 hover:text-pink-600"
                    >
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>
                </div>

                {loading ? (
                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <div className="flex min-h-[420px] items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
                        </div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-600">
                                <PackageSearch size={30} />
                            </div>

                            <h2 className="mt-5 text-2xl font-semibold text-[#151875]">
                                No orders yet
                            </h2>

                            <p className="mt-2 text-sm text-[#8A8FB9]">
                                You have not placed any orders yet.
                            </p>

                            <Link
                                to="/products"
                                className="mt-5 inline-flex items-center gap-2 rounded-md bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                            >
                                Browse Products
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
                            >
                                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-[#151875]">
                                            Order #{order.id}
                                        </h2>
                                        <p className="mt-1 text-sm text-[#8A8FB9]">
                                            {order.createdAt
                                                ? new Date(
                                                      order.createdAt
                                                  ).toLocaleString()
                                                : 'Date unavailable'}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                            {order.paymentMethod.replaceAll(
                                                '_',
                                                ' '
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px]">
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-4 rounded-xl bg-[#F8F9FD] p-4"
                                            >
                                                <div className="flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                                                    {item.product?.thumbnail ? (
                                                        <img
                                                            src={
                                                                item.product
                                                                    .thumbnail
                                                            }
                                                            alt={
                                                                item.product
                                                                    .title
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ShoppingBag
                                                            size={20}
                                                            className="text-[#8A8FB9]"
                                                        />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        to={`/products/${item.product?.id}`}
                                                        className="block truncate text-sm font-semibold text-[#151875] hover:text-pink-600"
                                                    >
                                                        {item.product?.title}
                                                    </Link>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {item.product?.category}
                                                    </p>

                                                    <p className="mt-2 text-sm text-slate-600">
                                                        Qty: {item.quantity} × $
                                                        {item.price}
                                                    </p>
                                                </div>

                                                <div className="text-sm font-semibold text-[#151875]">
                                                    $
                                                    {(
                                                        item.quantity *
                                                        item.price
                                                    ).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="h-fit rounded-xl bg-[#F8F9FD] p-4">
                                        <h3 className="text-base font-semibold text-[#151875]">
                                            Order Summary
                                        </h3>

                                        <div className="mt-4 space-y-3">
                                            <div className="flex items-center justify-between text-sm text-slate-600">
                                                <span>Items</span>
                                                <span>{order.items.length}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-slate-600">
                                                <span>Payment Status</span>
                                                <span>{order.paymentStatus}</span>
                                            </div>

                                            <div className="border-t border-slate-200 pt-3">
                                                <div className="flex items-center justify-between text-base font-semibold text-[#151875]">
                                                    <span>Total</span>
                                                    <span>
                                                        $
                                                        {Number(
                                                            order.totalAmount
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="pt-3">
                                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                    Shipping Address
                                                </p>
                                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                                    {order.shippingAddress}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default BuyerOrders