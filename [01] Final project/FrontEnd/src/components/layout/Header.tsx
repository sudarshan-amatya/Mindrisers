import { useState } from 'react'
import { Heart, Mail, Menu, Phone, ShoppingCart, User, X } from 'lucide-react'
import Navbar from '../Navbar'
import { Link } from 'react-router'

function Header() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <header className="bg-[#7E33E0] text-white shadow-md ">
                <div className="container">
                    <div className="flex min-h-13 items-center justify-between gap-3 py-2">
                        {/* Left */}
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

                        {/* Desktop right */}
                        <nav className="hidden items-center gap-2 md:flex">
                            <Link
                                to="/login"
                                className="flex items-center gap-2 rounded-full px-3 py-2 text-clamp transition hover:bg-white/10"
                            >
                                <User size={16} />
                                <span>Login</span>
                            </Link>

                            <button className="flex items-center gap-2 rounded-full px-3 py-2 text-clamp transition hover:bg-white/10">
                                <Heart size={16} />
                                <span>Wishlist</span>
                            </button>

                            <button className="relative flex items-center gap-2 rounded-full px-3 py-2 text-clamp transition hover:bg-white/10">
                                <ShoppingCart size={16} />
                                <span>Cart</span>
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-semibold text-[#7E33E0]">
                                    0
                                </span>
                            </button>
                        </nav>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 md:hidden"
                            aria-label="Toggle menu"
                        >
                            {open ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Mobile dropdown */}
                    <div
                        className={`overflow-hidden transition-all duration-300 md:hidden ${
                            open
                                ? 'max-h-80 pb-3 opacity-100'
                                : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="mt-2 rounded-2xl bg-white/10 p-2 backdrop-blur-md">
                            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-clamp transition hover:bg-white/10">
                                <User size={18} />
                                <span>Login</span>
                            </button>

                            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-clamp transition hover:bg-white/10">
                                <Heart size={18} />
                                <span>Wishlist</span>
                            </button>

                            <button className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-clamp transition hover:bg-white/10">
                                <span className="flex items-center gap-3">
                                    <ShoppingCart size={18} />
                                    <span>Cart</span>
                                </span>

                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-semibold text-[#7E33E0]">
                                    0
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <Navbar />
        </>
    )
}

export default Header
