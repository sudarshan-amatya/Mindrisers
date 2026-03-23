import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from '../pages/Home'
import Login from '../pages/Login'
import RootLayout from '../components/layout/RootLayout'
import NotFound from '../pages/NotFound'
import ProtectedRoute from '../components/ProtectedRoute'

const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            { index: true, Component: Home },
            { path: 'login', Component: Login },
            {
                path: 'seller',
                Component: ProtectedRoute,
                children: [
                    { path: 'products', Component: Login },
                    { path: 'orders', Component: Login },
                ],
            },
            { path: '*', Component: NotFound },
        ],
    },
])

export default function index() {
    return <RouterProvider router={router} />
}
