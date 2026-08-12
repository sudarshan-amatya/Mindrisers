import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import {
    LayoutDashboard,
    Users,
    UserCheck,
    Shapes,
    Package,
    ShoppingBag,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../redux/store'
import { logout } from '../../redux/slice/userSlice'
import { clearCartCount } from '../../redux/slice/cartSlice'

function AdminLayout() {
    const user = useSelector((root: RootState) => root.user.data)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout())
        dispatch(clearCartCount())
        navigate('/login')
    }

    const navItems = [
        {
            label: 'Dashboard',
            to: '/admin/dashboard',
            icon: LayoutDashboard,
        },
        {
            label: 'Users',
            to: '/admin/users',
            icon: Users,
        },
        {
            label: 'Seller Requests',
            to: '/admin/seller-requests',
            icon: UserCheck,
        },
        {
            label: 'Categories',
            to: '/admin/categories',
            icon: Shapes,
        },
        {
            label: 'Products',
            to: '/admin/products',
            icon: Package,
        },
        {
            label: 'Orders',
            to: '/admin/orders',
            icon: ShoppingBag,
        },
    ]

    return (
        <div className="min-h-screen bg-[#F6F7FB]">
            <div className="flex min-h-screen">
                <aside className="hidden w-70 shrink-0 border-r border-slate-200 bg-white xl:block">
                    <div className="flex h-18 items-center border-b border-slate-200 px-6">
                        <Link
                            to="/admin/dashboard"
                            className="text-2xl font-bold text-[#151875]"
                        >
                            Admin Panel
                        </Link>
                    </div>

                    <div className="p-4">
                        <nav className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon

                                return (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                                isActive
                                                    ? 'bg-pink-600 text-white'
                                                    : 'text-[#151875] hover:bg-pink-50 hover:text-pink-600'
                                            }`
                                        }
                                    >
                                        <Icon size={18} />
                                        <span>{item.label}</span>
                                    </NavLink>
                                )
                            })}
                        </nav>
                    </div>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="border-b border-slate-200 bg-white">
                        <div className="flex h-18 items-center justify-between px-4 md:px-6">
                            <div>
                                <h1 className="text-lg font-semibold text-[#151875]">
                                    Welcome back
                                </h1>
                                <p className="text-sm text-slate-500">
                                    {user?.firstName} {user?.lastName}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    to="/"
                                    className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#151875] transition hover:border-pink-500 hover:text-pink-600 xl:hidden"
                                >
                                    Store
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="cursor-pointer rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}

export default AdminLayout
