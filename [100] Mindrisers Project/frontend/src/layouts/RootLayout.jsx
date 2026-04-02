import { useEffect, useMemo, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import logo from "../assets/Mindrisers-removebg-preview.png";
import LoginDropdown from "../components/LoginDropdown";

export default function RootLayout() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, [isLoggedIn]);

  // ✅ Search + Category state
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("all");

  // ✅ categories from API
  const [categories, setCategories] = useState([]);

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

  // ✅ Submit search => go to /products page with query params
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const q = searchText.trim();

    navigate(
      `/products?search=${encodeURIComponent(q)}&category=${encodeURIComponent(
        category
      )}`
    );
  };

  return (
    <>
      <header className="flex gap-12 justify-center items-center px-16 py-4 bg-white rounded-b-2xl w-[98%] m-auto">
        <Link to="/">
          <img className="h-12" src={logo} alt="logoImg" />
        </Link>

        {/* ✅ same UI, only added form submit + state */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex border items-center rounded-4xl px-2 py-1 gap-3"
        >
          <select
            name="catogery"
            id="categoryId"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex justify-center outline-none cursor-pointer items-center"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            className="w-xl outline-none text-gray-600"
            type="text"
            name="search"
            id="searchId"
            placeholder="Search for Products, Brands and More"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <button type="submit" className="p-1 transition">
            <Search className="size-6 cursor-pointer text-gray-600" />
          </button>
        </form>

        <div className="flex gap-12">
          <LoginDropdown
            isLoggedIn={isLoggedIn}
            user={user}
            onLogout={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setIsLoggedIn(false);
              navigate("/");
            }}
          />

          {isLoggedIn ? (
            <Link to="/cart" className="flex gap-1.5 text-xl items-center">
              <ShoppingCart />
              Cart
            </Link>
          ) : (
            <div
              className="flex gap-1.5 text-xl items-center opacity-50 cursor-not-allowed"
              aria-disabled="true"
            >
              <ShoppingCart />
              Cart
            </div>
          )}
        </div>
      </header>

      {/* ✅ important: pass context if you need it in child pages */}
      <Outlet context={{ isLoggedIn, setIsLoggedIn }} />
    </>
  );
}
