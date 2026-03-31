import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    ChevronRight,
    Package,
    ShieldCheck,
    Star,
    Truck,
    WalletCards,
} from 'lucide-react'

import { getImageUrl } from '../helpers/getImageUrl'

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

export type CategoryType = {
    id: number | string
    name: string
    slug: string
    status: 'active' | 'inactive'
}

type CategoryOverview = {
    id: number | string
    name: string
    slug: string
    count: number
}

const API_BASE_URL = 'http://localhost:3000'

function Home() {
    const [products, setProducts] = useState<ProductType[]>([])
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true)

                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/products`),
                    axios.get(`${API_BASE_URL}/api/categories`),
                ])

                setProducts(productsRes?.data?.data || [])
                setCategories(categoriesRes?.data?.data || [])
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message ||
                        'Failed to load homepage data'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchHomeData()
    }, [])

    const activeProducts = useMemo(() => {
        return products.filter((product) => product.status === 'active')
    }, [products])

    const popularProducts = useMemo(() => {
        return [...activeProducts]
            .sort((a, b) => {
                const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0)
                if (ratingDiff !== 0) return ratingDiff

                const aDiscount =
                    a.discountPrice != null ? a.price - a.discountPrice : 0
                const bDiscount =
                    b.discountPrice != null ? b.price - b.discountPrice : 0

                if (bDiscount !== aDiscount) return bDiscount - aDiscount

                return (
                    new Date(b.createdAt || 0).getTime() -
                    new Date(a.createdAt || 0).getTime()
                )
            })
            .slice(0, 8)
    }, [activeProducts])

    const recommendedProducts = useMemo(() => {
        return [...activeProducts]
            .sort((a, b) => {
                const inStockDiff = Number(b.stock > 0) - Number(a.stock > 0)
                if (inStockDiff !== 0) return inStockDiff

                return (
                    new Date(b.createdAt || 0).getTime() -
                    new Date(a.createdAt || 0).getTime()
                )
            })
            .slice(0, 12)
    }, [activeProducts])

    const categoryOverview = useMemo(() => {
        const countMap = new Map<string, number>()

        activeProducts.forEach((product) => {
            const key = product.category?.trim()
            if (!key) return
            countMap.set(key, (countMap.get(key) || 0) + 1)
        })

        const categoryList: CategoryOverview[] = []

        categories
            .filter((category) => category.status === 'active')
            .forEach((category) => {
                categoryList.push({
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    count: countMap.get(category.name) || 0,
                })
                countMap.delete(category.name)
            })

        Array.from(countMap.entries()).forEach(([name, count], index) => {
            categoryList.push({
                id: `derived-${index}-${name}`,
                name,
                slug: name.toLowerCase().replace(/\s+/g, '-'),
                count,
            })
        })

        return categoryList.sort((a, b) => b.count - a.count).slice(0, 8)
    }, [categories, activeProducts])

    const heroProduct = popularProducts[0] || activeProducts[0]
    const secondaryBannerProduct = popularProducts[1] || activeProducts[1]
    const topCategory = categoryOverview[0]?.name || 'Electronics'
    const discountItemsCount = activeProducts.filter(
        (product) =>
            product.discountPrice != null &&
            product.discountPrice < product.price
    ).length

    return (
        <main className="min-h-screen bg-[#f3f4f6]">
            <section className="container py-5 md:py-6">
                <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    <div className="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#111827_0%,#1f2937_45%,#2563eb_100%)] text-white shadow-lg">
                        <div className="grid min-h-90 items-center gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
                            <div>
                                <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                                    Top banner
                                </span>

                                <h1 className="mt-4 max-w-xl text-[clamp(2rem,1.6rem+2vw,3.6rem)] font-bold leading-tight">
                                    Big deals on {heroProduct?.category || topCategory}
                                </h1>

                                <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 md:text-base">
                                    Discover trending products, featured
                                    categories, and smart picks for your store.
                                    This section is already connected to your
                                    real API, so when you add more products,
                                    this homepage fills automatically.
                                </p>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link
                                        to="/products"
                                        className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-semibold  transition hover:scale-[1.02]"
                                    >
                                        Shop now
                                        <ArrowRight size={16} />
                                    </Link>

                                    {heroProduct && (
                                        <Link
                                            to={`/products/${heroProduct.id}`}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                                        >
                                            View featured item
                                            <ChevronRight size={16} />
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                    <BannerStat
                                        label="Active products"
                                        value={String(activeProducts.length)}
                                    />
                                    <BannerStat
                                        label="Categories"
                                        value={String(categoryOverview.length)}
                                    />
                                    <BannerStat
                                        label="On discount"
                                        value={String(discountItemsCount)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="relative flex h-70 w-full max-w-85 items-center justify-center overflow-hidden rounded-4xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                                    {heroProduct?.thumbnail ? (
                                        <img
                                            src={getImageUrl(
                                                heroProduct.thumbnail
                                            )}
                                            alt={heroProduct.title}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center rounded-3xl bg-white/5">
                                            <Package
                                                size={72}
                                                className="text-white/70"
                                            />
                                        </div>
                                    )}

                                    {heroProduct && (
                                        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-slate-950/55 p-4 backdrop-blur-md">
                                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/65">
                                                Featured now
                                            </p>
                                            <h2 className="mt-1 line-clamp-1 text-lg font-semibold text-white">
                                                {heroProduct.title}
                                            </h2>
                                            <p className="mt-1 text-sm text-white/75">
                                                {heroProduct.category}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                        <SmallBannerCard
                            title={`Most popular in ${topCategory}`}
                            subtitle="Top viewed and best-rated items"
                            ctaLabel="Browse products"
                            to="/products"
                            accent="bg-[linear-gradient(135deg,#FB2E86,pink)]"
                            product={secondaryBannerProduct}
                        />

                        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Why shop here
                            </p>

                            <div className="mt-5 space-y-4">
                                <TrustRow
                                    icon={<Truck size={18} />}
                                    title="Fast delivery"
                                    text="Your upcoming products will show here automatically."
                                />
                                <TrustRow
                                    icon={<ShieldCheck size={18} />}
                                    title="Trusted checkout"
                                    text="Clean shopping flow from product page to checkout."
                                />
                                <TrustRow
                                    icon={<WalletCards size={18} />}
                                    title="Smart pricing"
                                    text="Discount prices are picked directly from your API."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container pb-4">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">
                            Quick access:
                        </span>

                        {categoryOverview.length > 0 ? (
                            categoryOverview.map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/products?category=${encodeURIComponent(
                                        category.name
                                    )}`}
                                    className="rounded-full bg-slate-100 px-4 py-2 font-medium transition hover:bg-slate-900 hover:text-white"
                                >
                                    {category.name}
                                </Link>
                            ))
                        ) : (
                            <Link
                                to="/products"
                                className="rounded-full bg-slate-100 px-4 py-2 font-medium transition hover:bg-slate-900 hover:text-white"
                            >
                                View all products
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <section className="container py-6 md:py-8">
                <SectionHeader
                    title="Most popular items"
                    subtitle="Show your best-rated and best-selling products first, just like a marketplace home page."
                    linkTo="/products"
                    linkLabel="See all products"
                />

                {loading ? (
                    <ProductSkeletonGrid count={4} />
                ) : popularProducts.length === 0 ? (
                    <EmptySection text="No popular products found yet." />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {popularProducts.map((product) => (
                            <MarketplaceProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="container py-6 md:py-8">
                <SectionHeader
                    title="Shop by categories"
                    subtitle="Category blocks are connected to your real categories and product data."
                    linkTo="/products"
                    linkLabel="Browse catalog"
                />

                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-36 animate-pulse rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
                            />
                        ))}
                    </div>
                ) : categoryOverview.length === 0 ? (
                    <EmptySection text="No categories available yet." />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {categoryOverview.map((category) => (
                            <Link
                                key={category.id}
                                to={`/products?category=${encodeURIComponent(
                                    category.name
                                )}`}
                                className="group rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#2563eb]">
                                        <Package size={26} />
                                    </div>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                        {category.count} items
                                    </span>
                                </div>

                                <h3 className="mt-5 text-xl font-semibold text-slate-950">
                                    {category.name}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Explore products from this category.
                                </p>

                                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb]">
                                    Shop now
                                    <ArrowRight
                                        size={16}
                                        className="transition group-hover:translate-x-1"
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section className="container py-6 md:py-8">
                <div className="rounded-4xl bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#4338ca_100%)] px-6 py-8 text-white shadow-lg md:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                                Recommended section
                            </p>
                            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                                More items for you
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
                                Right now you only have a couple of products,
                                so this area will reuse those real products.
                                When you add more later, this section will grow
                                automatically.
                            </p>
                        </div>

                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                        >
                            View all products
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                <div className="mt-5">
                    {loading ? (
                        <ProductSkeletonGrid count={6} />
                    ) : recommendedProducts.length === 0 ? (
                        <EmptySection text="No recommended items available yet." />
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {recommendedProducts.map((product) => (
                                <MarketplaceProductCard
                                    key={`for-you-${product.id}`}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

function SectionHeader({
    title,
    subtitle,
    linkTo,
    linkLabel,
}: {
    title: string
    subtitle: string
    linkTo: string
    linkLabel: string
}) {
    return (
        <div className="mb-5 flex flex-col gap-3 md:mb-6 md:flex-row md:items-end md:justify-between">
            <div>
                <h2 className="text-2xl font-bold text-slate-950 md:text-3xl">
                    {title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                    {subtitle}
                </p>
            </div>

            <Link
                to={linkTo}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb] transition hover:gap-3"
            >
                {linkLabel}
                <ArrowRight size={16} />
            </Link>
        </div>
    )
}

function BannerStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-white/65">
                {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-white">{value}</p>
        </div>
    )
}

function SmallBannerCard({
    title,
    subtitle,
    ctaLabel,
    to,
    accent,
    product,
}: {
    title: string
    subtitle: string
    ctaLabel: string
    to: string
    accent: string
    product?: ProductType
}) {
    return (
        <div className={`overflow-hidden rounded-3xl p-5 text-white ${accent}`}>
            <div className="flex h-full flex-col justify-between gap-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                        Promo banner
                    </p>
                    <h3 className="mt-2 text-2xl font-bold leading-tight">
                        {title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/85">
                        {subtitle}
                    </p>
                </div>

                {product && (
                    <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                        <p className="line-clamp-1 text-sm font-semibold">
                            {product.title}
                        </p>
                        <p className="mt-1 text-xs text-white/75">
                            {product.category}
                        </p>
                    </div>
                )}

                <Link
                    to={to}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white"
                >
                    {ctaLabel}
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    )
}

function TrustRow({
    icon,
    title,
    text,
}: {
    icon: React.ReactNode
    title: string
    text: string
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                {icon}
            </div>
            <div>
                <h4 className="font-semibold text-slate-950">{title}</h4>
                <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
            </div>
        </div>
    )
}

function MarketplaceProductCard({ product }: { product: ProductType }) {
    const finalPrice = product.discountPrice ?? product.price
    const hasDiscount =
        product.discountPrice != null && product.discountPrice < product.price
    const discountPercent = hasDiscount
        ? Math.round(((product.price - finalPrice) / product.price) * 100)
        : 0

    return (
        <div className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <Link to={`/products/${product.id}`} className="block">
                <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#f8fafc] p-4">
                    {hasDiscount && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#f59e0b] px-3 py-1 text-xs font-bold text-slate-950">
                            {discountPercent}% OFF
                        </span>
                    )}

                    {product.thumbnail ? (
                        <img
                            src={getImageUrl(product.thumbnail)}
                            alt={product.title}
                            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <Package size={50} className="text-slate-300" />
                    )}
                </div>
            </Link>

            <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
                        {product.category}
                    </span>

                    <div className="flex items-center gap-1 text-[#f59e0b]">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-semibold text-slate-700">
                            {product.rating ?? 4.5}
                        </span>
                    </div>
                </div>

                <Link to={`/products/${product.id}`} className="block">
                    <h3 className="mt-4 line-clamp-2 min-h-14 text-lg font-semibold leading-7 text-slate-950 transition group-hover:text-[#2563eb]">
                        {product.title}
                    </h3>
                </Link>

                <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
                    {product.description}
                </p>

                <div className="mt-4 flex items-end gap-2">
                    <span className="text-2xl font-bold text-slate-950">
                        ${finalPrice}
                    </span>

                    {hasDiscount && (
                        <span className="pb-1 text-sm text-slate-400 line-through">
                            ${product.price}
                        </span>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span
                        className={`text-sm font-semibold ${
                            product.stock > 0 ? 'text-green-600' : 'text-red-500'
                        }`}
                    >
                        {product.stock > 0
                            ? `${product.stock} in stock`
                            : 'Out of stock'}
                    </span>

                    <Link
                        to={`/products/${product.id}`}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
                    >
                        View item
                    </Link>
                </div>
            </div>
        </div>
    )
}

function ProductSkeletonGrid({ count }: { count: number }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                    <div className="h-64 animate-pulse bg-slate-100" />
                    <div className="space-y-3 p-5">
                        <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
                        <div className="h-6 w-full animate-pulse rounded bg-slate-100" />
                        <div className="h-6 w-3/4 animate-pulse rounded bg-slate-100" />
                        <div className="h-5 w-28 animate-pulse rounded bg-slate-100" />
                    </div>
                </div>
            ))}
        </div>
    )
}

function EmptySection({ text }: { text: string }) {
    return (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-600">{text}</p>
        </div>
    )
}

export default Home