import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

async function addToCartDB(product, qty) {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const res = await fetch("http://localhost:4000/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      qty,
    }),
  });

  return res.ok;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  const [qty, setQty] = useState(1);

  const [categories, setCategories] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  // ✅ toast popup
  const [toast, setToast] = useState("");

  // ✅ fetch product
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setQty(1);

        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        console.error(e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // ✅ fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("https://dummyjson.com/products/categories");
        const data = await res.json();

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

  // ✅ similar products
  useEffect(() => {
    async function fetchSimilar() {
      if (!product?.category) return;

      try {
        setSimilarLoading(true);
        const res = await fetch(
          `https://dummyjson.com/products/category/${product.category}?limit=12`
        );
        const data = await res.json();

        const list = (data.products || []).filter(
          (p) => String(p.id) !== String(product.id)
        );

        setSimilar(list.slice(0, 8));
      } catch (e) {
        console.error(e);
        setSimilar([]);
      } finally {
        setSimilarLoading(false);
      }
    }

    fetchSimilar();
  }, [product?.category, product?.id]);

  const currentCategory = useMemo(() => product?.category, [product]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ✅ Add to cart click handler
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true, state: { from: `/product/${id}` } });
      return;
    }

    const ok = await addToCartDB(product, qty);

    if (ok) showToast("Items added to cart ✅");
    else showToast("Failed to add to cart ❌");
  };

  // ✅ Buy Now handler
  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true, state: { from: `/product/${id}` } });
      return;
    }

    const ok = await addToCartDB(product, qty);

    if (ok) {
      showToast("Added ✅ Redirecting to cart...");
      setTimeout(() => navigate("/cart"), 800);
    } else {
      showToast("Failed ❌ Try again");
    }
  };

  if (loading) return <div className="w-[98%] m-auto mt-4">Loading...</div>;
  if (!product)
    return <div className="w-[98%] m-auto mt-4">Product not found</div>;

  return (
    <div className="w-[98%] m-auto mt-4 flex gap-4">
      {/* ✅ CENTER TOAST + BACKGROUND BLUR */}
      {toast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          {/* toast box */}
          <div className="relative bg-white border shadow-xl rounded-2xl px-6 py-4 text-sm font-medium">
            {toast}
          </div>
        </div>
      )}

      {/* ✅ LEFT SIDEBAR */}
      <div className="w-64 bg-white rounded-2xl p-4 sticky top-4 h-screen">
        <h3 className="text-lg font-semibold mb-3">Categories</h3>

        <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100%-40px)] pr-1">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className={`text-sm px-3 py-2 rounded-lg hover:bg-gray-100 ${
                cat.slug === currentCategory ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="flex-1">
        {/* PRODUCT DETAIL */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex gap-6">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-96 h-96 object-cover rounded-2xl"
            />

            <div className="flex flex-col gap-3 flex-1">
              <h1 className="text-3xl font-semibold">{product.title}</h1>
              <p className="text-gray-600">{product.description}</p>

              <div className="text-2xl font-bold">$ {product.price}</div>

              <div className="text-sm text-gray-500">
                Brand: {product.brand} • Category: {product.category}
              </div>

              {/* Quantity + Buy Now + Add to cart */}
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className="px-4 py-2 hover:bg-gray-100"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>

                  <input
                    className="w-14 text-center outline-none"
                    value={qty}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v)) setQty(Math.max(1, v));
                    }}
                  />

                  <button
                    type="button"
                    className="px-4 py-2 hover:bg-gray-100"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    +
                  </button>
                </div>

                {/* ✅ Buy Now button (before Add to Cart) */}
                <button
                  className="bg-[rgb(82,137,99)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[rgb(38,146,72)] cursor-pointer"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>

                <button
                  className="bg-[rgb(38,146,72)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[rgb(82,137,99)] cursor-pointer"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>

              <div className="mt-2 text-sm text-gray-500">
                <button className="hover:underline" onClick={() => navigate(-1)}>
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SIMILAR PRODUCTS */}
        <div className="bg-white rounded-2xl p-6 mt-4">
          <h2 className="text-xl font-semibold mb-4">Similar products</h2>

          {similarLoading ? (
            <div>Loading similar products...</div>
          ) : similar.length === 0 ? (
            <div className="text-gray-500">No similar products found.</div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {similar.map((p) => (
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
      </div>
    </div>
  );
}
