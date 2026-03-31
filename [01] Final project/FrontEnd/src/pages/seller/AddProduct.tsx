import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, PackagePlus } from 'lucide-react'

type ProductFormData = {
    title: string
    slug: string
    description: string
    price: string
    discountPrice: string
    stock: string
    brand: string
    category: string
    thumbnail: string
    images: string
    status: 'active' | 'inactive'
}

type CategoryType = {
    id: number | string
    name: string
    slug: string
    status: 'active' | 'inactive'
}

function AddProduct() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [imageFiles, setImageFiles] = useState<File[]>([])

    const [formData, setFormData] = useState<ProductFormData>({
        title: '',
        slug: '',
        description: '',
        price: '',
        discountPrice: '',
        stock: '',
        brand: '',
        category: '',
        thumbnail: '',
        images: '',
        status: 'active',
    })

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true)
                const res = await axios.get(
                    'http://localhost:3000/api/categories'
                )
                setCategories(res.data.data || [])
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message ||
                        'Failed to fetch categories'
                )
            } finally {
                setCategoriesLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value

        setFormData((prev) => ({
            ...prev,
            title,
            slug: title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-'),
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            return
        }

        try {
            setLoading(true)

            const form = new FormData()
            form.append('title', formData.title)
            form.append('slug', formData.slug)
            form.append('description', formData.description)
            form.append('price', formData.price)
            form.append('discountPrice', formData.discountPrice || '')
            form.append('stock', formData.stock)
            form.append('brand', formData.brand || '')
            form.append('category', formData.category)
            form.append('status', formData.status)

            if (thumbnailFile) {
                form.append('thumbnail', thumbnailFile)
            }

            imageFiles.forEach((file) => {
                form.append('images', file)
            })

            const res = await axios.post(
                'http://localhost:3000/api/seller/products',
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            toast.success(res.data.message || 'Product created successfully')
            navigate('/seller/products')
        } catch (error: any) {
            console.log(error?.response?.data)
            toast.error(
                error?.response?.data?.message || 'Failed to create product'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="min-h-screen bg-[#F6F7FB]">
            <div className="container py-8 md:py-10">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] font-bold text-[#151875]">
                            Add Product
                        </h1>
                        <p className="mt-1 text-sm text-[#8A8FB9]">
                            Create a new product for your store.
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

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:p-8">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                            <PackagePlus size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-[#151875]">
                                Product Information
                            </h2>
                            <p className="text-sm text-[#8A8FB9]">
                                Fill in the details below.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Product Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    placeholder="Enter product title"
                                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="product-slug"
                                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#151875]">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Write product description"
                                className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                            />
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Discount Price
                                </label>
                                <input
                                    type="number"
                                    name="discountPrice"
                                    value={formData.discountPrice}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Brand
                                </label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    placeholder="Apple, Samsung..."
                                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    disabled={categoriesLoading}
                                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.name}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Thumbnail
                                </label>

                                <label className="flex h-11 w-full cursor-pointer items-center rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-500 outline-none transition hover:border-pink-400 focus-within:ring-4 focus-within:ring-pink-100">
                                    <span className="truncate">
                                        {thumbnailFile
                                            ? thumbnailFile.name
                                            : 'Choose thumbnail image'}
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setThumbnailFile(
                                                e.target.files?.[0] || null
                                            )
                                        }
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Product Images
                                </label>

                                <label className="flex h-11 w-full cursor-pointer items-center rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-500 outline-none transition hover:border-pink-400 focus-within:ring-4 focus-within:ring-pink-100">
                                    <span className="truncate">
                                        {imageFiles.length > 0
                                            ? `${imageFiles.length} file(s) selected`
                                            : 'Choose product images'}
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) =>
                                            setImageFiles(
                                                Array.from(e.target.files || [])
                                            )
                                        }
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-md bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading
                                    ? 'Creating Product...'
                                    : 'Create Product'}
                            </button>

                            <Link
                                to="/seller/products"
                                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-[#151875] transition hover:border-pink-500 hover:text-pink-600"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default AddProduct
