import { useState } from 'react'
import {
    Heart,
    LogOut,
    Mail,
    Menu,
    Phone,
    ShoppingCart,
    Shield,
    User,
    X,
} from 'lucide-react'
import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../redux/store'
import { logout } from '../../redux/slice/userSlice'
import { clearCartCount } from '../../redux/slice/cartSlice'
import Navbar from '../Navbar'

function Header() {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)

    const user = useSelector((root: RootState) => root.user.data)
    const cartCount = useSelector((root: RootState) => root.cart.count)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(clearCartCount())
        setOpen(false)
    }

    return (
        <header className="border-b border-slate-200  text-white">
            <div className="container bg-[#7E33E0]">
                <div className="flex min-h-14 items-center justify-between gap-4 py-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
                        <a
                            href="mailto:support@commercehub.com"
                            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/85 transition hover:bg-white/10 sm:flex"
                        >
                            <Mail size={14} />
                            <span>support@commercehub.com</span>
                        </a>

                        <a
                            href="tel:+9779847881715"
                            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/85 transition hover:bg-white/10"
                        >
                            <Phone size={14} />
                            <span>+977 9847881715</span>
                        </a>

                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        {user?.isAdmin && (
                            <Link
                                to="/admin/dashboard"
                                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                            >
                                <Shield size={15} />
                                <span>Admin</span>
                            </Link>
                        )}

                        {user ? (
                            <div className="group relative">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
                                >
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-950">
                                        {user.firstName?.[0] ?? 'U'}
                                    </span>
                                    <span className="max-w-32 truncate">
                                        {[user.firstName, user.lastName]
                                            .filter(Boolean)
                                            .join(' ')}
                                    </span>
                                </button>

                                <div className="absolute right-0 top-full z-30 pt-2">
                                    <div className="pointer-events-none min-w-44 translate-y-2 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                                        >
                                            <User size={15} />
                                            <span>Profile</span>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                                        >
                                            <LogOut size={15} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                            >
                                <User size={15} />
                                <span>Login</span>
                            </Link>
                        )}

                        <Link
                            to="/wishlist"
                            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                        >
                            <Heart size={15} />
                            <span>Wishlist</span>
                        </Link>

                        <Link
                            to="/cart"
                            className="relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                        >
                            <ShoppingCart size={15} />
                            <span>Cart</span>
                            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-semibold text-slate-950">
                                {cartCount}
                            </span>
                        </Link>
                    </div>

                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 md:hidden"
                        aria-label="Toggle header menu"
                    >
                        {open ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                <div
                    className={`overflow-hidden transition-all duration-300 md:hidden ${
                        open ? 'max-h-96 pb-3 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-2">
                        {user?.isAdmin && (
                            <Link
                                to="/admin/dashboard"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                            >
                                <Shield size={17} />
                                <span>Admin</span>
                            </Link>
                        )}

                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                                >
                                    <User size={17} />
                                    <span>Profile</span>
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                                >
                                    <LogOut size={17} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                            >
                                <User size={17} />
                                <span>Login</span>
                            </Link>
                        )}

                        <Link
                            to="/wishlist"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                        >
                            <Heart size={17} />
                            <span>Wishlist</span>
                        </Link>

                        <Link
                            to="/cart"
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                        >
                            <span className="flex items-center gap-3">
                                <ShoppingCart size={17} />
                                <span>Cart</span>
                            </span>

                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-semibold text-slate-950">
                                {cartCount}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
            <Navbar />
        </header>
    )
}

export default Header
