import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from '../pages/Home'
import Login from '../pages/Login'
import RootLayout from '../components/layout/RootLayout'
import NotFound from '../pages/NotFound'
import ProtectedRoute from '../components/ProtectedRoute'
import Dashboard from '../pages/seller/Dashboard'
import Signup from '../pages/Signup'

const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            { index: true, Component: Home },
            { path: 'login', Component: Login },
            { path: 'signup', Component: Signup },
            {
                path: 'seller',
                Component: ProtectedRoute,
                children: [
                    { path: 'dashboard', Component: Dashboard },
                    { path: 'orders', Component: Dashboard },
                ],
            },
            { path: '*', Component: NotFound },
        ],
    },
])

export default function index() {
    return <RouterProvider router={router} />
}
