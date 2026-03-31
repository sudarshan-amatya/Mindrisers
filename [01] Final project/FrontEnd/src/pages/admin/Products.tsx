import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Package, Trash2 } from 'lucide-react'
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
}

function AdminProducts() {
    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<number | string | null>(null)

    const token = localStorage.getItem('accessToken')

    const fetchProducts = async () => {
        if (!token) {
            toast.error('Please login first')
            setLoading(false)
            return
        }

        try {
            setLoading(true)

            const res = await axios.get(
                'http://localhost:3000/api/admin/products',
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
        if (!token) {
            toast.error('Please login first')
            return
        }

        const confirmed = window.confirm(
            'Are you sure you want to delete this product?'
        )

        if (!confirmed) return

        try {
            setDeletingId(id)

            const res = await axios.delete(
                `http://localhost:3000/api/admin/products/${id}`,
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
            setDeletingId(null)
        }
    }

    return (
        <section className="min-h-screen bg-[#F6F7FB]">
            <div className="container py-8 md:py-10">
                <div className="mb-8">
                    <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2.5rem)] font-bold text-[#151875]">
                        Admin Products
                    </h1>
                    <p className="mt-1 text-sm text-[#8A8FB9]">
                        View and manage all products on the platform.
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    {loading ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
                            No products found.
                        </div>
                    ) : (
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
                                            Seller
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
                                    {products.map((product) => {
                                        const finalPrice =
                                            product.discountPrice ??
                                            product.price

                                        return (
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
                                                                    size={20}
                                                                    className="text-[#8A8FB9]"
                                                                />
                                                            )}
                                                        </div>

                                                        <div>
                                                            <p className="max-w-[220px] truncate text-sm font-semibold text-[#151875]">
                                                                {product.title}
                                                            </p>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {product.slug}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 text-sm text-slate-600">
                                                    {product.category}
                                                </td>

                                                <td className="py-4 text-sm text-slate-600">
                                                    ${finalPrice}
                                                </td>

                                                <td className="py-4 text-sm text-slate-600">
                                                    {product.stock}
                                                </td>

                                                <td className="py-4 text-sm text-slate-600">
                                                    #{product.sellerId}
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
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product.id
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                product.id
                                                            }
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:border-red-500 hover:text-red-500 disabled:opacity-60"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default AdminProducts
