import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Sparkles, Package, Heart, Gift, CreditCard } from "lucide-react";

export default function LoginDropdown({ isLoggedIn, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {isLoggedIn ? (
        <button className="flex items-center gap-2 rounded-md bg-[rgb(82,137,99)] px-4 py-2 text-white">
          <User size={18} />
          {user?.firstName || "User"}
        </button>
      ) : (
        <Link
          to="/login"
          className="flex items-center gap-2 rounded-md bg-[rgb(82,137,99)] px-4 py-2 text-white"
        >
          <User size={18} />
          Login
        </Link>
      )}

      {open && (
        <div className="absolute right-0 w-64 rounded-lg bg-white shadow-lg border z-10">
          {isLoggedIn ? (
            <>
              <ul className="py-2 text-sm">
                <MenuItem
                  to="/profile"
                  icon={<User size={18} />}
                  label="My Profile"
                  onClick={() => setOpen(false)}
                />

                <MenuItem
                  to="/orders"
                  icon={<Package size={18} />}
                  label="Orders"
                  onClick={() => setOpen(false)}
                />

                <MenuItem
                  to="/wishlist"
                  icon={<Heart size={18} />}
                  label="Wishlist"
                  onClick={() => setOpen(false)}
                />

                <MenuItem
                  to="/rewards"
                  icon={<Gift size={18} />}
                  label="Rewards"
                  onClick={() => setOpen(false)}
                />

                <MenuItem
                  to="/gift-cards"
                  icon={<CreditCard size={18} />}
                  label="Gift Cards"
                  onClick={() => setOpen(false)}
                />
              </ul>

              <div className="border-t px-4 py-3">
                <button
                  onClick={() => {
                    onLogout();
                    setOpen(false);
                    navigate("/", { replace: true });
                  }}
                  className="text-red-600 font-semibold w-full text-left cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="text-sm">New customer?</span>
                <Link
                  to="/signup"
                  className="text-green-700 font-semibold"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Link>
              </div>

              <ul className="py-2 text-sm">
                <MenuItem
                  to="/offers"
                  icon={<Sparkles size={18} />}
                  label="Top Offers"
                  onClick={() => setOpen(false)}
                />
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, to, onClick }) {
  // If "to" is provided -> Link, else fallback to normal list item
  if (to) {
    return (
      <li>
        <Link
          to={to}
          onClick={onClick}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {icon}
          <span>{label}</span>
        </Link>
      </li>
    );
  }

  return (
    <li
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
    >
      {icon}
      <span>{label}</span>
    </li>
  );
}
