import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react'

type CartProduct = {
    id: number | string
    title: string
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

function Checkout() {
    const navigate = useNavigate()
    const [cart, setCart] = useState<CartType | null>(null)
    const [loading, setLoading] = useState(true)
    const [placingOrder, setPlacingOrder] = useState(false)

    const [formData, setFormData] = useState({
        shippingAddress: '',
        paymentMethod: 'cash_on_delivery',
    })

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
            toast.error(error?.response?.data?.message || 'Failed to fetch cart')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const totals = useMemo(() => {
        const items = cart?.items || []

        const subtotal = items.reduce((sum, item) => {
            const price = item.product.discountPrice ?? item.product.price
            return sum + price * item.quantity
        }, 0)

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

        return { subtotal, totalItems }
    }, [cart])

    const handleChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            return
        }

        try {
            setPlacingOrder(true)

            const res = await axios.post(
                'http://localhost:3000/api/orders/checkout',
                {
                    shippingAddress: formData.shippingAddress,
                    paymentMethod: formData.paymentMethod,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            toast.success(res.data.message || 'Order placed successfully')
            navigate('/my-orders')
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to place order'
            )
        } finally {
            setPlacingOrder(false)
        }
    }

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

    if (!cart || cart.items.length === 0) {
        return (
            <section className="min-h-screen bg-[#F6F7FB]">
                <div className="container py-8 md:py-10">
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                        <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                            <h2 className="text-2xl font-semibold text-[#151875]">
                                Your cart is empty
                            </h2>
                            <p className="mt-2 text-sm text-[#8A8FB9]">
                                Add products to your cart before checkout.
                            </p>
                            <Link
                                to="/products"
                                className="mt-5 inline-flex items-center gap-2 rounded-md bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                            >
                                Browse Products
                            </Link>
                        </div>
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
                        <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2.5rem)] font-bold text-[#151875]">
                            Checkout
                        </h1>
                        <p className="mt-1 text-sm text-[#8A8FB9]">
                            Confirm your shipping details and place your order.
                        </p>
                    </div>

                    <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 rounded-md border border-[#E5E7F2] bg-white px-4 py-2 text-sm font-medium text-[#151875] transition hover:border-pink-500 hover:text-pink-600"
                    >
                        <ArrowLeft size={18} />
                        Back to Cart
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <form
                        onSubmit={handlePlaceOrder}
                        className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                                <MapPin size={22} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-[#151875]">
                                    Shipping Details
                                </h2>
                                <p className="text-sm text-[#8A8FB9]">
                                    Enter where your order should be delivered.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Shipping Address
                                </label>
                                <textarea
                                    name="shippingAddress"
                                    value={formData.shippingAddress}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Enter your full address"
                                    className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Payment Method
                                </label>
                                <div className="relative">
                                    <select
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                    >
                                        <option value="cash_on_delivery">
                                            Cash on Delivery
                                        </option>
                                    </select>
                                    <CreditCard className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8FB9]" size={18} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={placingOrder}
                            className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {placingOrder ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>

                    <div className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                        <h2 className="text-lg font-semibold text-[#151875]">
                            Order Summary
                        </h2>

                        <div className="mt-5 space-y-4">
                            {cart.items.map((item) => {
                                const price =
                                    item.product.discountPrice ??
                                    item.product.price

                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                                    >
                                        <div>
                                            <h3 className="text-sm font-medium text-[#151875]">
                                                {item.product.title}
                                            </h3>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>

                                        <span className="text-sm font-medium text-[#151875]">
                                            ${(price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between text-sm text-slate-600">
                                <span>Total Items</span>
                                <span>{totals.totalItems}</span>
                            </div>

                            <div className="flex items-center justify-between text-base font-semibold text-[#151875]">
                                <span>Total</span>
                                <span>${totals.subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Checkout