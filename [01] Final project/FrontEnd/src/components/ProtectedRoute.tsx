import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'
import type { RootState } from '../redux/store'

function ProtectedRoute() {
    const user = useSelector((root: RootState) => root.user.data)
    if (user) {
        return <Outlet />
    } else {
        return <Navigate to="/login" />
    }
}

export default ProtectedRoute
