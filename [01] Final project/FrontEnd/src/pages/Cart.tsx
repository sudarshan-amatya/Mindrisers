import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router'
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react'

type CartProduct = {
    id: number | string
    title: string
    slug: string
    price: number
    discountPrice?: number | null
    stock: number
    thumbnail?: string | null
    category: string
}

type CartItem = {
    id: number | string
    cartId: number | string
    productId: number | string
    quantity: number
    product: CartProduct
}

type CartType = {
    id: number | string
    userId: number | string
    items: CartItem[]
}

function Cart() {
    const [cart, setCart] = useState<CartType | null>(null)
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<number | string | null>(null)
    const [removingId, setRemovingId] = useState<number | string | null>(null)
    const [clearing, setClearing] = useState(false)

    const fetchCart = async () => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            setLoading(false)
            return
        }

        try {
            setLoading(true)

            const res = await axios.get('http://localhost:3000/api/cart', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            setCart(res.data.data)
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to fetch cart'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const handleQuantityChange = async (
        cartItemId: number | string,
        quantity: number
    ) => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            return
        }

        if (quantity < 1) return

        try {
            setUpdatingId(cartItemId)

            const res = await axios.patch(
                `http://localhost:3000/api/cart/${cartItemId}`,
                { quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setCart(res.data.data)
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to update cart item'
            )
        } finally {
            setUpdatingId(null)
        }
    }

    const handleRemoveItem = async (cartItemId: number | string) => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            return
        }

        try {
            setRemovingId(cartItemId)

            const res = await axios.delete(
                `http://localhost:3000/api/cart/${cartItemId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setCart(res.data.data)
            toast.success(res.data.message || 'Item removed')
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to remove item'
            )
        } finally {
            setRemovingId(null)
        }
    }

    const handleClearCart = async () => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            return
        }

        try {
            setClearing(true)

            const res = await axios.delete('http://localhost:3000/api/cart', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            setCart((prev) => (prev ? { ...prev, items: [] } : prev))
            toast.success(res.data.message || 'Cart cleared')
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to clear cart'
            )
        } finally {
            setClearing(false)
        }
    }

    const totals = useMemo(() => {
        const items = cart?.items || []

        const subtotal = items.reduce((sum, item) => {
            const price = item.product.discountPrice ?? item.product.price
            return sum + price * item.quantity
        }, 0)

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

        return { subtotal, totalItems }
    }, [cart])

    return (
        <section className="min-h-screen bg-[#F6F7FB]">
            <div className="container py-8 md:py-10">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2.5rem)] font-bold text-[#151875]">
                            My Cart
                        </h1>
                        <p className="mt-1 text-sm text-[#8A8FB9]">
                            Review your selected products before checkout.
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
                        <div className="flex min-h-105 items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
                        </div>
                    </div>
                ) : !cart || cart.items.length === 0 ? (
                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <div className="flex min-h-105 flex-col items-center justify-center text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-600">
                                <ShoppingCart size={30} />
                            </div>

                            <h2 className="mt-5 text-2xl font-semibold text-[#151875]">
                                Your cart is empty
                            </h2>

                            <p className="mt-2 text-sm text-[#8A8FB9]">
                                Add some products to your cart to continue.
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
                    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-sm text-[#8A8FB9]">
                                            <th className="pb-3 font-medium">
                                                Product
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Price
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Quantity
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Total
                                            </th>
                                            <th className="pb-3 text-right font-medium">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {cart.items.map((item) => {
                                            const price =
                                                item.product.discountPrice ??
                                                item.product.price
                                            const total = price * item.quantity

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="border-b border-slate-50 last:border-0"
                                                >
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-[#F8F9FD]">
                                                                {item.product
                                                                    .thumbnail ? (
                                                                    <img
                                                                        src={
                                                                            item
                                                                                .product
                                                                                .thumbnail
                                                                        }
                                                                        alt={
                                                                            item
                                                                                .product
                                                                                .title
                                                                        }
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <ShoppingCart
                                                                        size={
                                                                            20
                                                                        }
                                                                        className="text-[#8A8FB9]"
                                                                    />
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Link
                                                                    to={`/products/${item.product.id}`}
                                                                    className="text-sm font-semibold text-[#151875] hover:text-pink-600"
                                                                >
                                                                    {
                                                                        item
                                                                            .product
                                                                            .title
                                                                    }
                                                                </Link>
                                                                <p className="mt-1 text-xs text-slate-500">
                                                                    {
                                                                        item
                                                                            .product
                                                                            .category
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="py-4 text-sm text-slate-600">
                                                        ${price}
                                                    </td>

                                                    <td className="py-4">
                                                        <div className="flex w-fit items-center overflow-hidden rounded-md border border-slate-200">
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    updatingId ===
                                                                    item.id
                                                                }
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        item.id,
                                                                        item.quantity -
                                                                            1
                                                                    )
                                                                }
                                                                className="h-10 w-10 text-lg font-semibold text-[#151875] transition hover:bg-slate-50 disabled:opacity-50"
                                                            >
                                                                -
                                                            </button>

                                                            <span className="flex h-10 min-w-12 items-center justify-center text-sm font-medium text-[#151875]">
                                                                {item.quantity}
                                                            </span>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    updatingId ===
                                                                        item.id ||
                                                                    item.quantity >=
                                                                        item
                                                                            .product
                                                                            .stock
                                                                }
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        item.id,
                                                                        item.quantity +
                                                                            1
                                                                    )
                                                                }
                                                                className="h-10 w-10 text-lg font-semibold text-[#151875] transition hover:bg-slate-50 disabled:opacity-50"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </td>

                                                    <td className="py-4 text-sm font-semibold text-[#151875]">
                                                        ${total}
                                                    </td>

                                                    <td className="py-4">
                                                        <div className="flex justify-end">
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    removingId ===
                                                                    item.id
                                                                }
                                                                onClick={() =>
                                                                    handleRemoveItem(
                                                                        item.id
                                                                    )
                                                                }
                                                                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:border-red-500 hover:text-red-500 disabled:opacity-60"
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                            <h2 className="text-lg font-semibold text-[#151875]">
                                Order Summary
                            </h2>

                            <div className="mt-5 space-y-4">
                                <div className="flex items-center justify-between text-sm text-slate-600">
                                    <span>Total Items</span>
                                    <span>{totals.totalItems}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span>${totals.subtotal.toFixed(2)}</span>
                                </div>

                                <div className="border-t border-slate-100 pt-4">
                                    <div className="flex items-center justify-between text-base font-semibold text-[#151875]">
                                        <span>Total</span>
                                        <span>
                                            ${totals.subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                            >
                                Proceed to Checkout
                            </Link>

                            <button
                                type="button"
                                onClick={handleClearCart}
                                disabled={clearing}
                                className="mt-3 w-full rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-[#151875] transition hover:border-red-500 hover:text-red-500 disabled:opacity-60"
                            >
                                {clearing ? 'Clearing...' : 'Clear Cart'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Cart
