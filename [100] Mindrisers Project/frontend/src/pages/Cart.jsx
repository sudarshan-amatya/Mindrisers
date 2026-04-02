import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  async function fetchCart() {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateQty(productId, qty) {
    // ✅ never go below 1
    const safeQty = Math.max(1, qty);

    await fetch("http://localhost:4000/cart/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, qty: safeQty }),
    });

    fetchCart();
  }

  async function removeItem(productId) {
    await fetch(`http://localhost:4000/cart/remove/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchCart();
  }

  const total = useMemo(() => {
    return items.reduce((sum, it) => sum + it.price * it.qty, 0);
  }, [items]);

  // ✅ total items count (sum of qty)
  const totalItems = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
  }, [items]);

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <div className="w-[98%] m-auto mt-4">Loading...</div>;

  return (
    <div className="w-[98%] m-auto mt-4 bg-white rounded-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-gray-500">Cart is empty.</div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between border rounded-xl p-4"
              >
                {/* ✅ Click this section to go product page */}
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => navigate(`/product/${item.productId}`)}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-gray-500">$ {item.price}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="px-3 py-1 border rounded-lg"
                    onClick={() => updateQty(item.productId, item.qty - 1)}
                    disabled={item.qty <= 1}
                    style={{ opacity: item.qty <= 1 ? 0.5 : 1 }}
                    title={item.qty <= 1 ? "Minimum quantity is 1" : "Decrease"}
                  >
                    -
                  </button>

                  <div className="w-10 text-center">{item.qty}</div>

                  <button
                    className="px-3 py-1 border rounded-lg"
                    onClick={() => updateQty(item.productId, item.qty + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="font-semibold">
                    $ {(item.price * item.qty).toFixed(2)}
                  </div>

                  {/* ✅ Only this button removes */}
                  <button
                    className="text-red-600 font-semibold cursor-pointer"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Total + Checkout */}
          <div className="mt-6 flex items-center justify-end">
            <div className="text-xl font-bold">
              Total: $ {total.toFixed(2)}
            </div>
            <button
              className="bg-[rgb(38,146,72)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[rgb(82,137,99)] cursor-pointer ml-8"
              onClick={() => navigate("/checkout")}
            >
              Checkout ({totalItems})
            </button>
          </div>
        </>
      )}
    </div>
  );
}
