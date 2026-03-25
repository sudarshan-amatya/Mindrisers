import { useEffect, useState } from 'react'
import AppRoutes from './routes'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { login, logout } from './redux/slice/userSlice'

function App() {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('accessToken')

            if (!token) {
                setIsLoading(false)
                return
            }

            try {
                const res = await axios.get(
                    'http://localhost:3000/api/auth/me',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                dispatch(
                    login({
                        ...res.data.data,
                        token,
                    })
                )
            } catch (error) {
                localStorage.removeItem('accessToken')
                dispatch(logout())
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
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