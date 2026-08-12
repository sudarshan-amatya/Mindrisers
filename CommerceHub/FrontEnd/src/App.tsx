import { useEffect, useState } from 'react'
import AppRoutes from './routes'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { login, logout } from './redux/slice/userSlice'
import { setCartCount, clearCartCount } from './redux/slice/cartSlice'

function App() {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchInitialData = async () => {
            const token = localStorage.getItem('accessToken')

            if (!token) {
                setIsLoading(false)
                return
            }

            try {
                const userRes = await axios.get('http://localhost:3000/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const userData = userRes.data.data

                dispatch(
                    login({
                        ...userData,
                        token,
                    })
                )

                if (userData.isAdmin) {
                    dispatch(clearCartCount())
                } else {
                    const cartRes = await axios.get('http://localhost:3000/api/cart', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })

                    const cartItems = cartRes.data.data?.items || []
                    const totalCount = cartItems.reduce(
                        (sum: number, item: any) => sum + item.quantity,
                        0
                    )

                    dispatch(setCartCount(totalCount))
                }
            } catch (error) {
                localStorage.removeItem('accessToken')
                dispatch(logout())
                dispatch(clearCartCount())
            } finally {
                setIsLoading(false)
            }
        }

        fetchInitialData()
    }, [dispatch])

    return (
        <>
            <ToastContainer />
            {isLoading ? (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
                </div>
            ) : (
                <AppRoutes />
            )}
        </>
    )
}

export default App