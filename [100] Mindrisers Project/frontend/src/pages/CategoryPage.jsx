import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function CategoryPage() {
  const { category } = useParams();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // ✅ fetch categories for sidebar
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("https://dummyjson.com/products/categories");
        const data = await res.json();

        // supports both formats: ["smartphones"] OR [{slug,name,url}]
        const normalized = (data || []).map((c) => {
          if (typeof c === "string") return { slug: c, name: c };
          return { slug: c.slug, name: c.name };
        });

        setCategories(normalized);
      } catch (e) {
        console.error(e);
        setCategories([]);
      }
    }

    fetchCategories();
  }, []);

  // ✅ fetch products of selected category
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const res = await fetch(
          `https://dummyjson.com/products/category/${category}?limit=0`
        );
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
  }, [category]);

  return (
    <div className="w-[98%] m-auto mt-4 flex gap-4">
      {/* ✅ LEFT SIDEBAR */}
      <div className="w-64 bg-white rounded-2xl p-4 sticky top-4 h-screen">
        <h3 className="text-lg font-semibold mb-3">Categories</h3>

        <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100%-40px)] pr-1">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className={`text-sm px-3 py-2 rounded-lg hover:bg-gray-100 ${
                cat.slug === category ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ✅ RIGHT CONTENT */}
      <div className="flex-1 bg-white rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-4">{category}</h1>

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
                <div className="text-sm font-semibold mt-1">₹ {p.price}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
