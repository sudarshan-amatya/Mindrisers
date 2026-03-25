import { Menu, Search, X, ChevronDown } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { useState } from 'react'

function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <nav >
            <div className="container">
                <div className="flex items-center justify-between gap-10 py-4">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="shrink-0 text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] font-bold tracking-tight text-[#1D1D5B]"
                    >
                        Myshop
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden flex-1 items-center justify-between gap-8 lg:flex">
                        <ul className="flex items-center gap-7 text-clamp font-medium text-[#151875]">
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `flex items-center gap-1 transition hover:text-pink-500 ${
                                            isActive ? 'text-pink-500' : ''
                                        }`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/pages"
                                    className={({ isActive }) =>
                                        `transition hover:text-pink-500 ${isActive ? 'text-pink-500' : ''}`
                                    }
                                >
                                    Pages
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/products"
                                    className={({ isActive }) =>
                                        `transition hover:text-pink-500 ${isActive ? 'text-pink-500' : ''}`
                                    }
                                >
                                    Products
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/contact"
                                    className={({ isActive }) =>
                                        `transition hover:text-pink-500 ${isActive ? 'text-pink-500' : ''}`
                                    }
                                >
                                    Contact
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/seller/dashboard"
                                    className={({ isActive }) =>
                                        `transition hover:text-pink-500 ${isActive ? 'text-pink-500' : ''}`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            
                        </ul>

                        {/* Search */}
                        <div className="flex items-center overflow-hidden border border-gray-200">
                            <input
                                type="text"
                                placeholder="search"
                                className="h-10 w-55 px-3 text-sm text-[#151875] outline-none"
                            />
                            <Link
                                to="/search"
                                className="flex h-10 w-12 items-center justify-center bg-pink-500 text-white transition hover:bg-pink-600"
                                aria-label="Search"
                            >
                                <Search size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="flex h-10 w-10 items-center justify-center  text-[#151875] lg:hidden"
                        aria-label="Toggle menu"
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile menu */}
                <div
                    className={`overflow-hidden transition-all duration-300 lg:hidden ${
                        open
                            ? 'max-h-125 pb-4 opacity-100'
                            : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="space-y-3 border-t border-gray-100 pt-4">
                        <ul className="space-y-3 text-clamp font-medium text-[#151875]">
                            <li>
                                <Link
                                    to="/"
                                    className="flex items-center gap-1 text-pink-500"
                                    onClick={() => setOpen(false)}
                                >
                                    Home
                                    <ChevronDown size={14} />
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/pages"
                                    className="block transition hover:text-pink-500"
                                    onClick={() => setOpen(false)}
                                >
                                    Pages
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/products"
                                    className="block transition hover:text-pink-500"
                                    onClick={() => setOpen(false)}
                                >
                                    Products
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/blog"
                                    className="block transition hover:text-pink-500"
                                    onClick={() => setOpen(false)}
                                >
                                    Blog
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/shop"
                                    className="block transition hover:text-pink-500"
                                    onClick={() => setOpen(false)}
                                >
                                    Shop
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/contact"
                                    className="block transition hover:text-pink-500"
                                    onClick={() => setOpen(false)}
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>

                        <div className="flex items-center overflow-hidden border border-gray-200">
                            <input
                                type="text"
                                className="h-10 flex-1 px-3 text-sm text-[#151875] outline-none"
                                placeholder="Search..."
                            />
                            <Link
                                to="/search"
                                className="flex h-10 w-12 items-center justify-center bg-pink-500 text-white"
                                aria-label="Search"
                                onClick={() => setOpen(false)}
                            >
                                <Search size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
