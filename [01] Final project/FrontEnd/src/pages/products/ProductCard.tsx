import { Link } from 'react-router'
import { Package } from 'lucide-react'
import type { ProductType } from '../../pages/Products'
import { getImageUrl } from '../../helpers/getImageUrl'

type Props = {
    product: ProductType
}

function ProductCard({ product }: Props) {
    const finalPrice = product.discountPrice ?? product.price
    const hasDiscount =
        product.discountPrice != null && product.discountPrice < product.price

    return (
        <div className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md">
            <Link to={`/products/${product.id}`} className="block">
                <div className="flex h-64 items-center justify-center overflow-hidden bg-[#F8F9FD]">
                    {product.thumbnail ? (
                        <img
                            src={getImageUrl(product.thumbnail)}
                            alt={product.title}
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <Package size={40} className="text-[#8A8FB9]" />
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

                <Link
                    to={`/products/${product.id}`}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                >
                    View Details
                </Link>
            </div>
        </div>
    )
}

export default ProductCard
