import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

type ProductType = {
    id: number | string
    title: string
    slug: string
    thumbnail?: string | null
    category: string
}

type OrderItemType = {
    id: number | string
    orderId: number | string
    productId: number | string
    sellerId: number | string
    quantity: number
    price: number
    product: ProductType
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
    items: OrderItemType[]
}

function AdminOrders() {
    const [orders, setOrders] = useState<OrderType[]>([])
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem('accessToken')

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                toast.error('Please login first')
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                const res = await axios.get(
                    'http://localhost:3000/api/admin/orders',
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
    }, [token])

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
        <section className="p-4 md:p-6">
            <div className="mb-8">
                <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2.5rem)] font-bold text-[#151875]">
                    Admin Orders
                </h1>
                <p className="mt-1 text-sm text-[#8A8FB9]">
                    View all customer orders across the platform.
                </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                {loading ? (
                    <div className="flex min-h-[300px] items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
                        No orders found.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-xl border border-slate-100 bg-[#FCFCFF] p-5"
                            >
                                <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-[#151875]">
                                            Order #{order.id}
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Buyer ID: {order.userId}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {order.createdAt
                                                ? new Date(
                                                      order.createdAt
                                                  ).toLocaleString()
                                                : 'N/A'}
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

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="rounded-lg bg-white p-4 ring-1 ring-slate-100"
                                            >
                                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#151875]">
                                                            {item.product?.title}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Category:{' '}
                                                            {item.product?.category}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Seller ID:{' '}
                                                            {item.sellerId}
                                                        </p>
                                                    </div>

                                                    <div className="text-sm text-slate-600">
                                                        Qty: {item.quantity} × $
                                                        {item.price} ={' '}
                                                        <span className="font-semibold text-[#151875]">
                                                            $
                                                            {(
                                                                item.quantity *
                                                                item.price
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="h-fit rounded-xl bg-white p-4 ring-1 ring-slate-100">
                                        <h3 className="text-base font-semibold text-[#151875]">
                                            Summary
                                        </h3>

                                        <div className="mt-4 space-y-3 text-sm text-slate-600">
                                            <div className="flex items-center justify-between">
                                                <span>Items</span>
                                                <span>{order.items.length}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span>Total</span>
                                                <span className="font-semibold text-[#151875]">
                                                    $
                                                    {Number(
                                                        order.totalAmount
                                                    ).toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="border-t border-slate-100 pt-3">
                                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                    Shipping Address
                                                </p>
                                                <p className="mt-2 leading-6 text-slate-600">
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

export default AdminOrders