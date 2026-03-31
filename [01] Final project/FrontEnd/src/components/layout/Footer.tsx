import { Link } from 'react-router'
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

function Footer() {
    return (
        <footer className="bg-[#EEEFFB]">
            <div className="container py-12">
                <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
                    {/* Left */}
                    <div className="max-w-md">
                        <Link
                            to="/"
                            className="text-[clamp(1.8rem,1.5rem+1vw,2.4rem)] font-bold text-[#151875]"
                        >
                            Myshop
                        </Link>

                        <form className="mt-5 flex overflow-hidden rounded border border-slate-200 bg-white">
                            <input
                                type="email"
                                placeholder="Enter Email Address"
                                className="h-11 flex-1 px-4 text-sm text-slate-700 outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-pink-600 px-5 text-sm font-semibold text-white transition hover:bg-pink-700"
                            >
                                Sign Up
                            </button>
                        </form>

                        <div className="mt-5 space-y-1 text-sm text-[#8A8FB9]">
                            <p>Contact Info</p>
                            <p>Basundhara, Kathmandu</p>
                        </div>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#151875]">
                            Customer Care
                        </h3>
                        <ul className="mt-5 space-y-3 text-sm text-[#8A8FB9]">
                            <li>
                                <Link to="/account" className="transition hover:text-pink-600">
                                    My Account
                                </Link>
                            </li>
                            <li>
                                <Link to="/discount" className="transition hover:text-pink-600">
                                    Discount
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="transition hover:text-pink-600">
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders-history" className="transition hover:text-pink-600">
                                    Orders History
                                </Link>
                            </li>
                            <li>
                                <Link to="/order-tracking" className="transition hover:text-pink-600">
                                    Order Tracking
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Pages */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#151875]">
                            Pages
                        </h3>
                        <ul className="mt-5 space-y-3 text-sm text-[#8A8FB9]">
                         
                            <li>
                                <Link to="/products" className="transition hover:text-pink-600">
                                    Browse the Shop
                                </Link>
                            </li>
                            
                            <li>
                                <Link to="/contact" className="transition hover:text-pink-600">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-[#E7E4F8]">
                <div className="container flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
                    <p className="text-sm text-[#9DA0AE]">
                        ©Myshop - All Rights Reserved
                    </p>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#151875] text-white transition hover:bg-pink-600"
                            aria-label="Facebook"
                        >
                            <SiFacebook size={16} />
                        </Link>

                        <Link
                            to="/"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#151875] text-white transition hover:bg-pink-600"
                            aria-label="Instagram"
                        >
                            <SiInstagram size={16} />
                        </Link>

                        <Link
                            to="/"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#151875] text-white transition hover:bg-pink-600"
                            aria-label="X"
                        >
                            <SiX size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer