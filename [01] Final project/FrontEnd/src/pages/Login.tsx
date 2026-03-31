import { useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { login } from '../redux/slice/userSlice'
import { useNavigate, Link } from 'react-router'
import { toast } from 'react-toastify'

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await axios.post(
                'http://localhost:3000/api/auth/login',
                {
                    email,
                    password,
                }
            )

            const userData = res.data.data

            localStorage.setItem('accessToken', userData.token)
            dispatch(login(userData))
            toast.success(res.data.message || 'Login successful')
            if (userData.isAdmin) {
                navigate('/admin/dashboard')
            } else if (userData.isSeller) {
                navigate('/seller/dashboard')
            } else {
                navigate('/')
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Breadcrumbs />
            <main className="mx-auto max-w-6xl px-6">
                <section className="flex items-center justify-center py-10">
                    <div className="w-full max-w-md">
                        <div className="rounded-md bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
                            <div className="px-10 py-10">
                                <h2 className="text-center text-xl font-semibold text-slate-900">
                                    Login
                                </h2>
                                <p className="mt-1 text-center text-xs text-slate-500">
                                    Please login using account detail below.
                                </p>

                                <form
                                    className="mt-8 space-y-4"
                                    onSubmit={handleSubmit}
                                >
                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Email Address"
                                            className="h-11 w-full rounded border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                            autoComplete="email"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="Password"
                                            className="h-11 w-full rounded border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                            autoComplete="current-password"
                                        />
                                    </div>

                                    <div className="pt-1">
                                        <Link
                                            to="/forgot-password"
                                            className="text-xs text-slate-500 hover:text-slate-700"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-1 h-11 w-full cursor-pointer rounded bg-pink-600 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-200 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </button>

                                    <p className="pt-3 text-center text-xs text-slate-500">
                                        Don&apos;t have an account?
                                        <Link
                                            to="/signup"
                                            className="ml-1 text-slate-600 hover:text-pink-600"
                                        >
                                            Create account
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Login
