import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'
import type { RootState } from '../redux/store'

function PublicStoreOnlyRoute() {
    const user = useSelector((root: RootState) => root.user.data)

    if (user?.isAdmin) {
        return <Navigate to="/admin/dashboard" replace />
    }

    return <Outlet />
}

export default PublicStoreOnlyRoute