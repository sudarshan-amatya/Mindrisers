import type { SortOption } from '../../pages/Products'

type Props = {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    categories: string[]
    selectedCategory: string
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>
    sortBy: SortOption
    setSortBy: React.Dispatch<React.SetStateAction<SortOption>>
    onlyDiscounted: boolean
    setOnlyDiscounted: React.Dispatch<React.SetStateAction<boolean>>
    onlyInStock: boolean
    setOnlyInStock: React.Dispatch<React.SetStateAction<boolean>>
}

function ProductFilters({
    search,
    setSearch,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    onlyDiscounted,
    setOnlyDiscounted,
    onlyInStock,
    setOnlyInStock,
}: Props) {
    return (
        <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div>
                <h2 className="text-lg font-semibold text-[#151875]">Filters</h2>
                <p className="mt-1 text-sm text-[#8A8FB9]">
                    Narrow down your products
                </p>
            </div>

            <div className="mt-6 space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-medium text-[#151875]">
                        Search
                    </label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[#151875]">
                        Category
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[#151875]">
                        Sort By
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    >
                        <option value="newest">Newest</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="rating-high-low">Rating</option>
                        <option value="discount-high-low">Biggest Discount</option>
                    </select>
                </div>

                <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-[#151875]">
                        <input
                            type="checkbox"
                            checked={onlyDiscounted}
                            onChange={(e) => setOnlyDiscounted(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                        />
                        Discounted Products
                    </label>

                    <label className="flex items-center gap-3 text-sm text-[#151875]">
                        <input
                            type="checkbox"
                            checked={onlyInStock}
                            onChange={(e) => setOnlyInStock(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                        />
                        In Stock Only
                    </label>
                </div>
            </div>
        </aside>
    )
}

export default ProductFilters