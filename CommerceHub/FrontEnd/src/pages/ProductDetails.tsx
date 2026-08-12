import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setCartCount } from '../redux/slice/cartSlice'
import {
    ArrowLeft,
    BadgeCheck,
    Heart,
    Package,
    ShoppingCart,
    Tag,
} from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs'
import { getImageUrl } from '../helpers/getImageUrl'

type ProductType = {
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
    createdAt?: string
    updatedAt?: string
}

function ProductDetails() {
    const { id } = useParams()
    const dispatch = useDispatch()

    const [product, setProduct] = useState<ProductType | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState('')
    const [cartLoading, setCartLoading] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const updateCartCountFromResponse = (cartData: any) => {
        const cartItems = cartData?.items || []
        const totalCount = cartItems.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
        )
        dispatch(setCartCount(totalCount))
    }

    const handleAddToWishlist = async () => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            return
        }

        if (!product) return

        try {
            setWishlistLoading(true)

            const res = await axios.post(
                'http://localhost:3000/api/wishlist',
                {
                    productId: product.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            toast.success(res.data.message || 'Product added to wishlist')
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to add product to wishlist'
            )
        } finally {
            setWishlistLoading(false)
        }
    }

    const handleAddToCart = async () => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            return
        }

        if (!product) return

        try {
            setCartLoading(true)

            const res = await axios.post(
                'http://localhost:3000/api/cart',
                {
                    productId: product.id,
                    quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            updateCartCountFromResponse(res.data.data)
            toast.success(res.data.message || 'Product added to cart')
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to add product to cart'
            )
        } finally {
            setCartLoading(false)
        }
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)

                const res = await axios.get(
                    `http://localhost:3000/api/products/${id}`
                )

                const productData = res.data.data
                setProduct(productData)

                const allImages = [
                    productData.thumbnail,
                    ...(Array.isArray(productData.images)
                        ? productData.images
                        : []),
                ].filter(Boolean)

                setSelectedImage(allImages[0] || '')
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message || 'Failed to fetch product'
                )
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchProduct()
        }
    }, [id])

    if (loading) {
        return (
            <section className="min-h-screen bg-[#F6F7FB]">
                <div className="container py-10">
                    <div className="flex min-h-[60vh] items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
                    </div>
                </div>
            </section>
        )
    }

    if (!product) {
        return (
            <section className="min-h-screen bg-[#F6F7FB]">
                <div className="container py-10">
                    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-600">
                            <Package size={30} />
                        </div>

                        <h2 className="mt-5 text-2xl font-semibold text-[#151875]">
                            Product not found
                        </h2>

                        <p className="mt-2 text-sm text-[#8A8FB9]">
                            The product you are looking for does not exist.
                        </p>

                        <Link
                            to="/products"
                            className="mt-5 inline-flex items-center gap-2 rounded-md bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                        >
                            <ArrowLeft size={18} />
                            Back to Products
                        </Link>
                    </div>
                </div>
            </section>
        )
    }

    const imageList = [
        product.thumbnail,
        ...(Array.isArray(product.images) ? product.images : []),
    ].filter(Boolean) as string[]

    return (
        <section className="min-h-screen bg-[#F6F7FB]">
            <div className="container py-8 md:py-10">
                <div className="mb-6">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 rounded-md border border-[#E5E7F2] bg-white px-4 py-2 text-sm font-medium text-[#151875] transition hover:border-pink-500 hover:text-pink-600"
                    >
                        <ArrowLeft size={18} />
                        Back to Products
                    </Link>
                </div>

                <div className="grid gap-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:p-8 lg:grid-cols-2">
                    <div>
                        <div className="flex h-95 items-center justify-center overflow-hidden rounded-2xl bg-[#F8F9FD]">
                            {selectedImage ? (
                                <img
                                    src={getImageUrl(selectedImage)}
                                    alt={product.title}
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <Package size={48} className="text-[#8A8FB9]" />
                            )}
                        </div>

                        {imageList.length > 1 && (
                            <div className="mt-4 flex flex-wrap gap-3">
                                {imageList.map((image, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setSelectedImage(image)}
                                        className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border transition ${
                                            selectedImage === image
                                                ? 'border-pink-500'
                                                : 'border-slate-200'
                                        }`}
                                    >
                                    
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600">
                                {product.category}
                            </span>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    product.status === 'active'
                                        ? 'bg-green-50 text-green-600'
                                        : 'bg-slate-100 text-slate-600'
                                }`}
                            >
                                {product.status}
                            </span>
                        </div>

                        <h1 className="mt-4 text-[clamp(1.6rem,1.3rem+1vw,2.5rem)] font-bold text-[#151875]">
                            {product.title}
                        </h1>

                        <div className="mt-5 flex items-end gap-3">
                            {product.discountPrice ? (
                                <>
                                    <span className="text-3xl font-bold text-pink-600">
                                        ${product.discountPrice}
                                    </span>
                                    <span className="text-lg text-slate-400 line-through">
                                        ${product.price}
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-pink-600">
                                    ${product.price}
                                </span>
                            )}
                        </div>

                        <div className="mt-5 space-y-3 text-sm text-slate-600">
                            {product.brand && (
                                <div className="flex items-center gap-2">
                                    <Tag size={16} className="text-pink-600" />
                                    <span>
                                        <span className="font-medium text-[#151875]">
                                            Brand:
                                        </span>{' '}
                                        {product.brand}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <Package size={16} className="text-pink-600" />
                                <span>
                                    <span className="font-medium text-[#151875]">
                                        Stock:
                                    </span>{' '}
                                    {product.stock > 0
                                        ? `${product.stock} available`
                                        : 'Out of stock'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <BadgeCheck
                                    size={16}
                                    className="text-pink-600"
                                />
                                <span>
                                    <span className="font-medium text-[#151875]">
                                        Slug:
                                    </span>{' '}
                                    {product.slug}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-[#151875]">
                                Description
                            </h2>
                            <p className="mt-3 leading-7 text-[#8A8FB9]">
                                {product.description}
                            </p>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <div className="flex items-center overflow-hidden rounded-md border border-slate-200 bg-white">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity((prev) =>
                                            Math.max(1, prev - 1)
                                        )
                                    }
                                    className="h-11 w-11 text-lg font-semibold text-[#151875] transition hover:bg-slate-50"
                                >
                                    -
                                </button>

                                <span className="flex h-11 min-w-12 items-center justify-center text-sm font-medium text-[#151875]">
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity((prev) => prev + 1)
                                    }
                                    className="h-11 w-11 text-lg font-semibold text-[#151875] transition hover:bg-slate-50"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={cartLoading || product.stock <= 0}
                                className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <ShoppingCart size={18} />
                                {cartLoading ? 'Adding...' : 'Add to Cart'}
                            </button>

                            <Link
                                to="/cart"
                                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-[#151875] transition hover:border-pink-500 hover:text-pink-600"
                            >
                                Go to Cart
                            </Link>

                            <button
                                type="button"
                                onClick={handleAddToWishlist}
                                disabled={wishlistLoading}
                                className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-[#151875] transition hover:border-pink-500 hover:text-pink-600 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <Heart size={18} />
                                {wishlistLoading ? 'Saving...' : 'Wishlist'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductDetails
