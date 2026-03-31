import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router'
import { toast } from 'react-toastify'
import {
    ArrowLeft,
    Package,
    Plus,
    Pencil,
    Trash2,
    Eye,
    PackageSearch,
} from 'lucide-react'
import { getImageUrl } from '../../helpers/getImageUrl'

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

function SellerProducts() {
    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteLoadingId, setDeleteLoadingId] = useState<
        number | string | null
    >(null)

    const fetchProducts = async () => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            setLoading(false)
            return
        }

        try {
            setLoading(true)

            const res = await axios.get(
                'http://localhost:3000/api/seller/products',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setProducts(res.data.data || [])
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to fetch products'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleDelete = async (id: number | string) => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            return
        }

        const confirmed = window.confirm(
            'Are you sure you want to delete this product?'
        )

        if (!confirmed) return

        try {
            setDeleteLoadingId(id)

            const res = await axios.delete(
                `http://localhost:3000/api/seller/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setProducts((prev) => prev.filter((product) => product.id !== id))
            toast.success(res.data.message || 'Product deleted successfully')
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to delete product'
            )
        } finally {
            setDeleteLoadingId(null)
        }
    }

    return (
        <section className="min-h-screen bg-[#F6F7FB]">
            <div className="container py-8 md:py-10">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] font-bold text-[#151875]">
                            My Products
                        </h1>
                        <p className="mt-1 text-sm text-[#8A8FB9]">
                            Manage all products in your store.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/seller/dashboard"
                            className="inline-flex items-center gap-2 rounded-md border border-[#E5E7F2] bg-white px-4 py-2 text-sm font-medium text-[#151875] transition hover:border-pink-500 hover:text-pink-600"
                        >
                            <ArrowLeft size={18} />
                            Dashboard
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

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:p-6">
                    {loading ? (
                        <div className="flex min-h-75 items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex min-h-80 flex-col items-center justify-center text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-600">
                                <PackageSearch size={30} />
                            </div>

                            <h2 className="mt-5 text-xl font-semibold text-[#151875]">
                                No products yet
                            </h2>

                            <p className="mt-2 max-w-md text-sm text-[#8A8FB9]">
                                You haven’t added any products yet. Start by
                                creating your first product.
                            </p>

                            <Link
                                to="/seller/products/create"
                                className="mt-5 inline-flex items-center gap-2 rounded-md bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                            >
                                <Plus size={18} />
                                Add Product
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-[#151875]">
                                        Product List
                                    </h2>
                                    <p className="mt-1 text-sm text-[#8A8FB9]">
                                        Total products: {products.length}
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-sm text-[#8A8FB9]">
                                            <th className="pb-3 font-medium">
                                                Product
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Category
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Price
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Stock
                                            </th>
                                            <th className="pb-3 font-medium">
                                                Status
                                            </th>
                                            <th className="pb-3 text-right font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {products.map((product) => (
                                            <tr
                                                key={product.id}
                                                className="border-b border-slate-50 last:border-0"
                                            >
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-[#F8F9FD]">
                                                            {product.thumbnail ? (
                                                                <img
                                                                    src={getImageUrl(
                                                                        product.thumbnail
                                                                    )}
                                                                    alt={
                                                                        product.title
                                                                    }
                                                                    className="h-full w-full object-contain"
                                                                />
                                                            ) : (
                                                                <Package
                                                                    size={22}
                                                                    className="text-[#8A8FB9]"
                                                                />
                                                            )}
                                                        </div>

                                                        <div>
                                                            <h3 className="max-w-55 truncate text-sm font-semibold text-[#151875]">
                                                                {product.title}
                                                            </h3>
                                                            <p className="mt-1 max-w-60 truncate text-xs text-slate-500">
                                                                {product.slug}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 text-sm text-slate-600">
                                                    {product.category}
                                                </td>

                                                <td className="py-4 text-sm text-slate-600">
                                                    {product.discountPrice ? (
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-[#151875]">
                                                                $
                                                                {
                                                                    product.discountPrice
                                                                }
                                                            </span>
                                                            <span className="text-xs text-slate-400 line-through">
                                                                ${product.price}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        `$${product.price}`
                                                    )}
                                                </td>

                                                <td className="py-4 text-sm text-slate-600">
                                                    {product.stock}
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

                                                <td className="py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            to={`/products/${product.id}`}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:border-pink-500 hover:text-pink-600"
                                                            title="View"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>

                                                        <Link
                                                            to={`/seller/products/edit/${product.id}`}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:border-pink-500 hover:text-pink-600"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={16} />
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product.id
                                                                )
                                                            }
                                                            disabled={
                                                                deleteLoadingId ===
                                                                product.id
                                                            }
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:border-red-500 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

export default SellerProducts
