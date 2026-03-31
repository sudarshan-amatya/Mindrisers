import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from '../pages/Home'
import Login from '../pages/Login'
import RootLayout from '../components/layout/RootLayout'
import NotFound from '../pages/NotFound'
import ProtectedRoute, {
    SellerProtectedRoute,
    AdminProtectedRoute,
} from '../components/ProtectedRoute'
import Dashboard from '../pages/seller/Dashboard'
import Signup from '../pages/Signup'
import SellerProducts from '../pages/seller/Products'
import Products from '../pages/Products'
import AddProduct from '../pages/seller/AddProduct'
import EditProduct from '../pages/seller/EditProduct'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import BuyerOrders from '../pages/BuyerOrders'
import SellerOrders from '../pages/seller/Orders'
import Profile from '../pages/Profile'
import EditProfile from '../pages/EditProfile'
import Wishlist from '../pages/Wishlist'
import AdminCategories from '../pages/admin/Categories'
import SellerRequests from '../pages/admin/SellerRequests'
import AdminUsers from '../pages/admin/Users'
import AdminProducts from '../pages/admin/Products'
import AdminDashboard from '../pages/admin/Dashboard'
import AdminLayout from '../components/layout/AdminLayout'
import AdminOrders from '../pages/admin/Orders'
import PublicStoreOnlyRoute from '../components/PublicStoreOnlyRoute'
import Contact from '../pages/Contact'


const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            {
                path: '',
                Component: PublicStoreOnlyRoute,
                children: [
                    { index: true, Component: Home },
                    { path: 'login', Component: Login },
                    { path: 'signup', Component: Signup },
                    { path: 'products', Component: Products },
                    { path: 'products/:id', Component: ProductDetails },
                    { path: 'contact', Component: Contact },
                ],
            },
            {
                path: '',
                Component: ProtectedRoute,
                children: [
                    { path: 'cart', Component: Cart },
                    { path: 'checkout', Component: Checkout },
                    { path: 'my-orders', Component: BuyerOrders },
                    { path: 'profile', Component: Profile },
                    { path: 'profile/edit', Component: EditProfile },
                    { path: 'wishlist', Component: Wishlist },
                ],
            },
            {
                path: 'seller',
                Component: SellerProtectedRoute,
                children: [
                    { path: 'dashboard', Component: Dashboard },
                    { path: 'orders', Component: SellerOrders },
                    { path: 'products', Component: SellerProducts },
                    { path: 'products/create', Component: AddProduct },
                    { path: 'products/edit/:id', Component: EditProduct },
                ],
            },
            { path: '*', Component: NotFound },
        ],
    },
    {
        path: '/admin',
        Component: AdminProtectedRoute,
        children: [
            {
                Component: AdminLayout,
                children: [
                    { path: 'dashboard', Component: AdminDashboard },
                    { path: 'users', Component: AdminUsers },
                    { path: 'seller-requests', Component: SellerRequests },
                    { path: 'categories', Component: AdminCategories },
                    { path: 'products', Component: AdminProducts },
                    { path: 'orders', Component: AdminOrders },
                ],
            },
        ],
    },
])

export default function AppRoutes() {
    return <RouterProvider router={router} />
}
