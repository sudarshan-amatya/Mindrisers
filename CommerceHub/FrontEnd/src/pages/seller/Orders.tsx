import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router'
import { ArrowLeft, PackageSearch, ShoppingBag } from 'lucide-react'

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
}

type ProductType = {
    id: number | string
    title: string
    slug: string
    thumbnail?: string | null
    category: string
}

type SellerOrderItemType = {
    id: number | string
    orderId: number | string
    productId: number | string
    sellerId: number | string
    quantity: number
    price: number
    createdAt?: string
    updatedAt?: string
    order: OrderType
    product: ProductType
}

function SellerOrders() {
    const [orders, setOrders] = useState<SellerOrderItemType[]>([])
    const [loading, setLoading] = useState(true)
    const [updatingOrderId, setUpdatingOrderId] = useState<number | string | null>(
        null
    )

    const fetchOrders = async () => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            setLoading(false)
            return
        }

        try {
            setLoading(true)

            const res = await axios.get('http://localhost:3000/api/seller/orders', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            setOrders(res.data.data || [])
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to fetch seller orders'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleStatusChange = async (
        orderId: number | string,
        status: OrderType['status']
    ) => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            return
        }

        try {
            setUpdatingOrderId(orderId)

            const res = await axios.patch(
                `http://localhost:3000/api/seller/orders/${orderId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const updatedOrder = res.data.data

            setOrders((prev) =>
                prev.map((item) =>
                    item.orderId === orderId
                        ? {
                              ...item,
                              order: {
                                  ...item.order,
                                  status: updatedOrder.status,
                              },
                          }
                        : item
                )
            )

            toast.success(res.data.message || 'Order status updated successfully')
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to update order status'
            )
        } finally {
            setUpdatingOrderId(null)
        }
    }

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
                            Seller Orders
                        </h1>
                        <p className="mt-1 text-sm text-[#8A8FB9]">
                            Manage incoming orders for your products.
                        </p>
                    </div>

                    <Link
                        to="/seller/dashboard"
                        className="inline-flex items-center gap-2 rounded-md border border-[#E5E7F2] bg-white px-4 py-2 text-sm font-medium text-[#151875] transition hover:border-pink-500 hover:text-pink-600"
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
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
                                You have not received any seller orders yet.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {orders.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
                            >
                                <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr_220px]">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F8F9FD]">
                                            {item.product?.thumbnail ? (
                                                <img
                                                    src={item.product.thumbnail}
                                                    alt={item.product.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <ShoppingBag
                                                    size={24}
                                                    className="text-[#8A8FB9]"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <Link
                                                to={`/products/${item.product?.id}`}
                                                className="block truncate text-base font-semibold text-[#151875] hover:text-pink-600"
                                            >
                                                {item.product?.title}
                                            </Link>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {item.product?.category}
                                            </p>

                                            <p className="mt-2 text-sm text-slate-600">
                                                Quantity: {item.quantity}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-600">
                                                Price: ${item.price}
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-[#151875]">
                                                Total: $
                                                {(item.quantity * item.price).toFixed(
                                                    2
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                            Order Details
                                        </h3>

                                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                                            <p>
                                                <span className="font-medium text-[#151875]">
                                                    Order ID:
                                                </span>{' '}
                                                #{item.order?.id}
                                            </p>

                                            <p>
                                                <span className="font-medium text-[#151875]">
                                                    Payment:
                                                </span>{' '}
                                                {item.order?.paymentMethod?.replaceAll(
                                                    '_',
                                                    ' '
                                                )}
                                            </p>

                                            <p>
                                                <span className="font-medium text-[#151875]">
                                                    Payment Status:
                                                </span>{' '}
                                                {item.order?.paymentStatus}
                                            </p>

                                            <p>
                                                <span className="font-medium text-[#151875]">
                                                    Ordered At:
                                                </span>{' '}
                                                {item.order?.createdAt
                                                    ? new Date(
                                                          item.order.createdAt
                                                      ).toLocaleString()
                                                    : 'N/A'}
                                            </p>

                                            <div className="pt-1">
                                                <p className="font-medium text-[#151875]">
                                                    Shipping Address:
                                                </p>
                                                <p className="mt-1 leading-6 text-slate-600">
                                                    {item.order?.shippingAddress}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                                                    item.order?.status
                                                )}`}
                                            >
                                                {item.order?.status}
                                            </span>
                                        </div>

                                        <label className="mb-2 block text-sm font-medium text-[#151875]">
                                            Update Status
                                        </label>

                                        <select
                                            value={item.order?.status}
                                            disabled={updatingOrderId === item.orderId}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    item.orderId,
                                                    e.target
                                                        .value as OrderType['status']
                                                )
                                            }
                                            className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100 disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">
                                                Confirmed
                                            </option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">
                                                Delivered
                                            </option>
                                            <option value="cancelled">
                                                Cancelled
                                            </option>
                                        </select>
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

export default SellerOrders