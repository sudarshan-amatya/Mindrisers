import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function ProductsPage() {
  const [params] = useSearchParams();
  const search = (params.get("search") || "").trim();
  const category = params.get("category") || "all";

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        // ✅ If category selected (not all) => fetch category products first
        if (category !== "all") {
          const res = await fetch(
            `https://dummyjson.com/products/category/${encodeURIComponent(
              category
            )}?limit=0`
          );

          if (!res.ok) {
            setProducts([]);
            return;
          }

          const data = await res.json();
          let list = data.products || [];

          // ✅ if search text exists, filter inside category results
          if (search) {
            const q = search.toLowerCase();
            list = list.filter(
              (p) =>
                p.title?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.brand?.toLowerCase().includes(q)
            );
          }

          setProducts(list);
          return;
        }

        // ✅ If category = all but search exists => use dummyjson search endpoint
        if (search) {
          const res = await fetch(
            `https://dummyjson.com/products/search?q=${encodeURIComponent(
              search
            )}&limit=0`
          );
          const data = await res.json();
          setProducts(data.products || []);
          return;
        }

        // ✅ If no search and category = all => show all products
        const res = await fetch("https://dummyjson.com/products?limit=0");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (e) {
        console.error(e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [search, category]);

  return (
    <div className="w-[98%] m-auto mt-4 bg-white rounded-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Products{" "}
        {category !== "all" ? (
          <span className="text-gray-500 text-lg">({category})</span>
        ) : null}
        {search ? (
          <span className="text-gray-500 text-lg"> - "{search}"</span>
        ) : null}
      </h1>

      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="border rounded-xl p-3 hover:shadow-sm transition"
            >
              <img
                src={p.thumbnail}
                alt={p.title}
                className="w-full h-36 object-contain rounded-lg"
              />
              <div className="mt-2 text-sm font-medium line-clamp-1">
                {p.title}
              </div>
              <div className="text-sm font-semibold mt-1">$ {p.price}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
