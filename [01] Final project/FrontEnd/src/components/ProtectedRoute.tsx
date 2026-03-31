import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'
import type { RootState } from '../redux/store'

function ProtectedRoute() {
    const user = useSelector((root: RootState) => root.user.data)

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (user.isAdmin) {
        return <Navigate to="/admin/dashboard" replace />
    }

    return <Outlet />
}

export function SellerProtectedRoute() {
    const user = useSelector((root: RootState) => root.user.data)

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (user.isAdmin) {
        return <Navigate to="/admin/dashboard" replace />
    }

    if (!user.isSeller) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export function AdminProtectedRoute() {
    const user = useSelector((root: RootState) => root.user.data)

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!user.isAdmin) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
