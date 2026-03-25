import { useState } from 'react'
import {
    Heart,
    LogOut,
    Mail,
    Menu,
    Phone,
    ShoppingCart,
    User,
    X,
} from 'lucide-react'
import Navbar from '../Navbar'
import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../redux/store'
import { logout } from '../../redux/slice/userSlice'

function Header() {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const user = useSelector((root: RootState) => root.user.data)

    const handleLogout = () => {
        dispatch(logout())
        setOpen(false)
    }

    return (
        <>
            <header className="bg-[#7E33E0] text-white shadow-md">
                <div className="container">
                    <div className="flex min-h-13 items-center justify-between gap-3 py-2">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-clamp">
                            <a
                                href="mailto:e-commerce@gmail.com"
                                className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm transition hover:bg-white/20"
                            >
                                <Mail size={15} className="shrink-0" />
                                <span className="text-clamp">
                                    e-commerce@gmail.com
                                </span>
                            </a>

                            <a
                                href="tel:+9779847881715"
                                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm transition hover:bg-white/20"
                            >
                                <Phone size={15} className="shrink-0" />
                                <span className="text-clamp">
                                    +977-9847881715
                                </span>
                            </a>
                        </div>

                        <nav className="hidden items-center gap-2 md:flex">
                            {user ? (
                                <div className="group relative">
                                    <button
                                        type="button"
                                        className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-clamp font-medium text-white/95 backdrop-blur-sm"
                                    >
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#7E33E0]">
                                            {user.firstName?.[0]}
                                        </span>
                                        <span className="max-w-35 truncate">
                                            {[user.firstName, user.lastName]
                                                .filter(Boolean)
                                                .join(' ')}
                                        </span>
                                    </button>

                                    <div className="absolute right-0 top-full z-20 pt-1">
                                        <div className="pointer-events-none min-w-35 translate-y-2 rounded-xl bg-white py-2 opacity-0 shadow-lg ring-1 ring-black/5 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-pink-600"
                                            >
                                                <LogOut size={16} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 rounded-full px-3 py-2 text-clamp font-medium text-white transition hover:bg-white/10"
                                >
                                    <User size={16} />
                                    <span>Login</span>
                                </Link>
                            )}

                            <Link
                                to="/wishlist"
                                className="flex items-center gap-2 rounded-full px-3 py-2 text-clamp font-medium text-white transition hover:bg-white/10"
                            >
                                <Heart size={16} />
                                <span>Wishlist</span>
                            </Link>

                            <Link
                                to="/cart"
                                className="relative flex items-center gap-2 rounded-full px-3 py-2 text-clamp font-medium text-white transition hover:bg-white/10"
                            >
                                <ShoppingCart size={16} />
                                <span>Cart</span>
                                <span className="absolute -right-3 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-semibold text-[#7E33E0] shadow-sm">
                                    0
                                </span>
                            </Link>
                        </nav>

                        <button
                            onClick={() => setOpen(!open)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 md:hidden"
                            aria-label="Toggle menu"
                            type="button"
                        >
                            {open ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    <div
                        className={`overflow-hidden transition-all duration-300 md:hidden ${
                            open
                                ? 'max-h-80 pb-3 opacity-100'
                                : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="mt-2 rounded-2xl bg-white/10 p-2 backdrop-blur-md">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-clamp">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#7E33E0]">
                                            {user.firstName?.[0]}
                                        </span>
                                        <span>
                                            {[user.firstName, user.lastName]
                                                .filter(Boolean)
                                                .join(' ')}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-clamp transition hover:bg-white/10"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setOpen(false)}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-clamp transition hover:bg-white/10"
                                >
                                    <User size={18} />
                                    <span>Login</span>
                                </Link>
                            )}

                            <Link
                                to="/wishlist"
                                onClick={() => setOpen(false)}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-clamp transition hover:bg-white/10"
                            >
                                <Heart size={18} />
                                <span>Wishlist</span>
                            </Link>

                            <Link
                                to="/cart"
                                onClick={() => setOpen(false)}
                                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-clamp transition hover:bg-white/10"
                            >
                                <span className="flex items-center gap-3">
                                    <ShoppingCart size={18} />
                                    <span>Cart</span>
                                </span>

                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-semibold text-[#7E33E0]">
                                    0
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <Navbar />
        </>
    )
}

export default Header