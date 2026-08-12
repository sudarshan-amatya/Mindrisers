import ProductCard from './ProductCard'
import type { ProductType } from '../../pages/Products'
import { PackageSearch } from 'lucide-react'

type Props = {
    loading: boolean
    products: ProductType[]
}

function ProductGrid({ loading, products }: Props) {
    if (loading) {
        return (
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex min-h-125 items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
                </div>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex min-h-125 flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-600">
                        <PackageSearch size={30} />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold text-[#151875]">
                        No products found
                    </h2>

                    <p className="mt-2 max-w-md text-sm text-[#8A8FB9]">
                        Try changing the category, sort option, or search query.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-100">
                <p className="text-sm text-[#8A8FB9]">
                    Showing <span className="font-semibold text-[#151875]">{products.length}</span> products
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default ProductGrid