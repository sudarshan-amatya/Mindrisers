import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router'
import { ArrowLeft, Heart, Package, ShoppingCart, Trash2 } from 'lucide-react'
import { getImageUrl } from '../helpers/getImageUrl'

type WishlistProduct = {
    id: number | string
    title: string
    slug: string
    description: string
    price: number
    discountPrice?: number | null
    stock: number
    brand?: string | null
    category: string
    thumbnail?: string | null
    images?: string[]
    status: 'active' | 'inactive'
    sellerId: number | string
}

type WishlistItem = {
    id: number | string
    userId: number | string
    productId: number | string
    product: WishlistProduct
}

function Wishlist() {
    const [items, setItems] = useState<WishlistItem[]>([])
    const [loading, setLoading] = useState(true)
    const [removingId, setRemovingId] = useState<number | string | null>(null)
    const [addingCartId, setAddingCartId] = useState<number | string | null>(
        null
    )

    const fetchWishlist = async () => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            setLoading(false)
            return
        }

        try {
            setLoading(true)

            const res = await axios.get('http://localhost:3000/api/wishlist', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            setItems(res.data.data || [])
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to fetch wishlist'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWishlist()
    }, [])

    const handleRemove = async (wishlistId: number | string) => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            return
        }

        try {
            setRemovingId(wishlistId)

            const res = await axios.delete(
                `http://localhost:3000/api/wishlist/${wishlistId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setItems(res.data.data || [])
            toast.success(res.data.message || 'Removed from wishlist')
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to remove wishlist item'
            )
        } finally {
            setRemovingId(null)
        }
    }

    const handleAddToCart = async (productId: number | string) => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            return
        }

        try {
            setAddingCartId(productId)

            const res = await axios.post(
                'http://localhost:3000/api/cart',
                {
                    productId,
                    quantity: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            toast.success(res.data.message || 'Product added to cart')
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to add to cart'
            )
        } finally {
            setAddingCartId(null)
        }
    }

    return (
        <section className="min-h-screen bg-[#F6F7FB]">
            <div className="container py-8 md:py-10">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2.5rem)] font-bold text-[#151875]">
                            My Wishlist
                        </h1>
                        <p className="mt-1 text-sm text-[#8A8FB9]">
                            Products you saved for later.
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
                ) : items.length === 0 ? (
                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-600">
                                <Heart size={30} />
                            </div>

                            <h2 className="mt-5 text-2xl font-semibold text-[#151875]">
                                Your wishlist is empty
                            </h2>

                            <p className="mt-2 text-sm text-[#8A8FB9]">
                                Save products you like and view them later.
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
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {items.map((item) => {
                            const product = item.product
                            const finalPrice =
                                product.discountPrice ?? product.price
                            const hasDiscount =
                                product.discountPrice != null &&
                                product.discountPrice < product.price

                            return (
                                <div
                                    key={item.id}
                                    className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"
                                >
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="block"
                                    >
                                        <div className="flex h-64 items-center justify-center overflow-hidden bg-[#F8F9FD]">
                                            {product.thumbnail ? (
                                                <img
                                                    src={getImageUrl(
                                                        product.thumbnail
                                                    )}
                                                    alt={product.title}
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <Package
                                                    size={40}
                                                    className="text-[#8A8FB9]"
                                                />
                                            )}
                                        </div>
                                    </Link>

                                    <div className="p-5">
                                        <div className="mb-3 flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600">
                                                {product.category}
                                            </span>

                                            {hasDiscount && (
                                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                                                    Discount
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="truncate text-lg font-semibold text-[#151875]">
                                            {product.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#8A8FB9]">
                                            {product.description}
                                        </p>

                                        <div className="mt-4 flex items-end gap-2">
                                            <span className="text-xl font-bold text-pink-600">
                                                ${finalPrice}
                                            </span>

                                            {hasDiscount && (
                                                <span className="text-sm text-slate-400 line-through">
                                                    ${product.price}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-2 flex items-center justify-between text-sm">
                                            <span className="text-slate-500">
                                                {product.brand || 'No brand'}
                                            </span>

                                            <span
                                                className={`font-medium ${
                                                    product.stock > 0
                                                        ? 'text-green-600'
                                                        : 'text-red-500'
                                                }`}
                                            >
                                                {product.stock > 0
                                                    ? `${product.stock} in stock`
                                                    : 'Out of stock'}
                                            </span>
                                        </div>

                                        <div className="mt-5 grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAddToCart(product.id)
                                                }
                                                disabled={
                                                    addingCartId ===
                                                        product.id ||
                                                    product.stock <= 0
                                                }
                                                className="inline-flex items-center justify-center gap-2 rounded-md bg-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                <ShoppingCart size={16} />
                                                {addingCartId === product.id
                                                    ? 'Adding...'
                                                    : 'Add to Cart'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(item.id)
                                                }
                                                disabled={
                                                    removingId === item.id
                                                }
                                                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#151875] transition hover:border-red-500 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                <Trash2 size={16} />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Wishlist
