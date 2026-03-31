import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Pencil, Plus, Trash2 } from 'lucide-react'

type CategoryType = {
    id: number | string
    name: string
    slug: string
    status: 'active' | 'inactive'
    createdAt?: string
}

function AdminCategories() {
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<number | string | null>(null)
    const [deletingId, setDeletingId] = useState<number | string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        status: 'active' as 'active' | 'inactive',
    })

    const token = localStorage.getItem('accessToken')

    const fetchCategories = async () => {
        if (!token) return

        try {
            setLoading(true)

            const res = await axios.get(
                'http://localhost:3000/api/admin/categories',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setCategories(res.data.data || [])
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to fetch categories'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            status: 'active',
        })
        setEditingId(null)
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value

        setFormData((prev) => ({
            ...prev,
            name,
            slug: name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-'),
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!token) {
            toast.error('Please login first')
            return
        }

        try {
            setSaving(true)

            if (editingId) {
                const res = await axios.patch(
                    `http://localhost:3000/api/admin/categories/${editingId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                toast.success(res.data.message || 'Category updated successfully')
            } else {
                const res = await axios.post(
                    'http://localhost:3000/api/admin/categories',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                toast.success(res.data.message || 'Category created successfully')
            }

            resetForm()
            fetchCategories()
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to save category'
            )
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (category: CategoryType) => {
        setEditingId(category.id)
        setFormData({
            name: category.name,
            slug: category.slug,
            status: category.status,
        })
    }

    const handleDelete = async (id: number | string) => {
        if (!token) {
            toast.error('Please login first')
            return
        }

        const confirmed = window.confirm(
            'Are you sure you want to delete this category?'
        )

        if (!confirmed) return

        try {
            setDeletingId(id)

            const res = await axios.delete(
                `http://localhost:3000/api/admin/categories/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            toast.success(res.data.message || 'Category deleted successfully')
            fetchCategories()
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to delete category'
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
                        Admin Categories
                    </h1>
                    <p className="mt-1 text-sm text-[#8A8FB9]">
                        Create and manage product categories.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                        <h2 className="text-lg font-semibold text-[#151875]">
                            {editingId ? 'Edit Category' : 'Add Category'}
                        </h2>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
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
                                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#151875]">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:opacity-70"
                                >
                                    <Plus size={16} />
                                    {saving
                                        ? 'Saving...'
                                        : editingId
                                          ? 'Update'
                                          : 'Create'}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#151875] transition hover:border-pink-500 hover:text-pink-600"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                        <h2 className="text-lg font-semibold text-[#151875]">
                            Category List
                        </h2>

                        {loading ? (
                            <div className="flex min-h-[300px] items-center justify-center">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
                                No categories found.
                            </div>
                        ) : (
                            <div className="mt-5 overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-sm text-[#8A8FB9]">
                                            <th className="pb-3 font-medium">Name</th>
                                            <th className="pb-3 font-medium">Slug</th>
                                            <th className="pb-3 font-medium">Status</th>
                                            <th className="pb-3 text-right font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="border-b border-slate-50 last:border-0"
                                            >
                                                <td className="py-4 text-sm font-medium text-[#151875]">
                                                    {category.name}
                                                </td>
                                                <td className="py-4 text-sm text-slate-600">
                                                    {category.slug}
                                                </td>
                                                <td className="py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                            category.status ===
                                                            'active'
                                                                ? 'bg-green-50 text-green-600'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}
                                                    >
                                                        {category.status}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(category)
                                                            }
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:border-pink-500 hover:text-pink-600"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    category.id
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                category.id
                                                            }
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:border-red-500 hover:text-red-500 disabled:opacity-60"
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
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AdminCategories