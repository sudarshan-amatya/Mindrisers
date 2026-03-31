import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import ProductFilters from './products/ProductFilters'
import ProductGrid from './products/ProductGrid'
import Breadcrumbs from '../components/Breadcrumbs'

export type ProductType = {
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
    rating?: number
    createdAt?: string
    updatedAt?: string
}

type CategoryType = {
    id: number | string
    name: string
    slug: string
    status: 'active' | 'inactive'
}

export type SortOption =
    | 'newest'
    | 'price-low-high'
    | 'price-high-low'
    | 'rating-high-low'
    | 'discount-high-low'

function Products() {
    const [products, setProducts] = useState<ProductType[]>([])
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [sortBy, setSortBy] = useState<SortOption>('newest')
    const [onlyDiscounted, setOnlyDiscounted] = useState(false)
    const [onlyInStock, setOnlyInStock] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/products'),
                    axios.get('http://localhost:3000/api/categories'),
                ])

                setProducts(productsRes.data.data || [])
                setCategories(categoriesRes.data.data || [])
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message || 'Failed to fetch data'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const categoryOptions = useMemo(() => {
        return ['all', ...categories.map((category) => category.name)]
    }, [categories])

    const filteredProducts = useMemo(() => {
        let filtered = [...products]

        if (search.trim()) {
            const searchValue = search.toLowerCase()
            filtered = filtered.filter(
                (product) =>
                    product.title.toLowerCase().includes(searchValue) ||
                    product.description.toLowerCase().includes(searchValue) ||
                    product.category.toLowerCase().includes(searchValue) ||
                    (product.brand || '').toLowerCase().includes(searchValue)
            )
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(
                (product) => product.category === selectedCategory
            )
        }

        if (onlyDiscounted) {
            filtered = filtered.filter(
                (product) =>
                    product.discountPrice != null &&
                    product.discountPrice < product.price
            )
        }

        if (onlyInStock) {
            filtered = filtered.filter((product) => product.stock > 0)
        }

        filtered.sort((a, b) => {
            const aFinalPrice = a.discountPrice ?? a.price
            const bFinalPrice = b.discountPrice ?? b.price
            const aDiscount = a.discountPrice ? a.price - a.discountPrice : 0
            const bDiscount = b.discountPrice ? b.price - b.discountPrice : 0
            const aRating = a.rating ?? 0
            const bRating = b.rating ?? 0

            switch (sortBy) {
                case 'price-low-high':
                    return aFinalPrice - bFinalPrice
                case 'price-high-low':
                    return bFinalPrice - aFinalPrice
                case 'rating-high-low':
                    return bRating - aRating
                case 'discount-high-low':
                    return bDiscount - aDiscount
                case 'newest':
                default:
                    return (
                        new Date(b.createdAt || '').getTime() -
                        new Date(a.createdAt || '').getTime()
                    )
            }
        })

        return filtered
    }, [
        products,
        search,
        selectedCategory,
        sortBy,
        onlyDiscounted,
        onlyInStock,
    ])

    return (
        <section className="min-h-screen bg-[#F6F7FB]">
            <Breadcrumbs />
            <div className="container py-8 md:py-5">
                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    <ProductFilters
                        search={search}
                        setSearch={setSearch}
                        categories={categoryOptions}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        onlyDiscounted={onlyDiscounted}
                        setOnlyDiscounted={setOnlyDiscounted}
                        onlyInStock={onlyInStock}
                        setOnlyInStock={setOnlyInStock}
                    />

                    <ProductGrid
                        loading={loading}
                        products={filteredProducts}
                    />
                </div>
            </div>
        </section>
    )
}

export default Products
