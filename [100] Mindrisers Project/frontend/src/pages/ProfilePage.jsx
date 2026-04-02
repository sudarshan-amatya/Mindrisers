import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link, useOutletContext } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useOutletContext();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const fullName = useMemo(() => {
    if (!user) return "";
    return [user.firstName, user.lastName].filter(Boolean).join(" ");
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/", { replace: true });
  };

  if (!user) {
    return (
      <div className="w-[98%] m-auto mt-4 bg-white rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">My Profile</h1>
        <p className="text-gray-600">No user found. Please login again.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-[rgb(38,146,72)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[rgb(82,137,99)] cursor-pointer"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-[98%] m-auto mt-4 flex gap-4">
      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-white rounded-2xl p-4 h-fit sticky top-4">
        <h2 className="text-lg font-semibold mb-3">Dashboard</h2>

        <div className="flex flex-col gap-2">
          <a href="#profile" className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100">
            Profile
          </a>
          <a href="#orders" className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100">
            Orders
          </a>
          <a href="#addresses" className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100">
            Addresses
          </a>

          <Link
            to="/cart"
            className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100 flex justify-between"
          >
            <span>Cart</span>
          </Link>

          <button
            onClick={handleLogout}
            className="text-sm px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 text-left"
          >
            Logout
          </button>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col gap-4">
        {/* PROFILE CARD */}
        <div id="profile" className="bg-white rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">My Profile</h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your account information
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="border rounded-xl p-4">
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="font-semibold mt-1">{fullName || "-"}</p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-semibold mt-1">{user.email || "-"}</p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-xs text-gray-500">Birthday</p>
              <p className="font-semibold mt-1">null</p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-xs text-gray-500">Gender</p>
              <p className="font-semibold mt-1">null</p>
            </div>
          </div>

          {/* Optional: edit profile (UI only for now) */}
          <div className="mt-6 flex gap-3">
            <button
              className="bg-[rgb(38,146,72)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[rgb(82,137,99)] cursor-pointer"
              onClick={() => alert("Edit profile coming soon")}
            >
              Edit Profile
            </button>

            <button
              className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
              onClick={() => navigate("/")}
            >
              Go Home
            </button>
          </div>
        </div>

        {/* ORDERS */}
        <div id="orders" className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p className="text-gray-500 text-sm">
            Orders feature can be added next (from DB).
          </p>

          <div className="mt-4 border rounded-xl p-4 text-gray-500 text-sm">
            No orders yet.
          </div>
        </div>

        {/* ADDRESSES */}
        <div id="addresses" className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Addresses</h2>
          <p className="text-gray-500 text-sm">
            Save delivery addresses here (we can store in DB later).
          </p>

          <div className="mt-4 border rounded-xl p-4 text-gray-500 text-sm">
            No saved addresses.
          </div>
        </div>
      </div>
    </div>
  );
}
