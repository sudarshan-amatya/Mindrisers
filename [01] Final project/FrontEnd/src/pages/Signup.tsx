import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify'
import { z } from 'zod'
import Breadcrumbs from '../components/Breadcrumbs'

const signupSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(2, 'First name must be at least 2 characters'),
        lastName: z
            .string()
            .trim()
            .min(2, 'Last name must be at least 2 characters'),
        email: z.email('Please enter a valid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
            .regex(/[a-z]/, 'Password must include at least one lowercase letter')
            .regex(/[0-9]/, 'Password must include at least one number')
            .regex(
                /[^A-Za-z0-9]/,
                'Password must include at least one special character'
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

type FormDataType = z.infer<typeof signupSchema>

function Signup() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState<FormDataType>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const [errors, setErrors] = useState<
        Partial<Record<keyof FormDataType, string>>
    >({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }))
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const result = signupSchema.safeParse(formData)

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors

            setErrors({
                firstName: fieldErrors.firstName?.[0],
                lastName: fieldErrors.lastName?.[0],
                email: fieldErrors.email?.[0],
                password: fieldErrors.password?.[0],
                confirmPassword: fieldErrors.confirmPassword?.[0],
            })

            return
        }

        setErrors({})
        setLoading(true)

        try {
            const payload = {
                firstName: result.data.firstName.trim(),
                lastName: result.data.lastName.trim(),
                email: result.data.email.trim(),
                password: result.data.password,
            }

            const res = await axios.post(
                'http://localhost:3000/api/auth/signup',
                payload
            )

            toast.success(res.data.message || 'Account created successfully')
            navigate('/login')
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Something went wrong'
            )
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
                                    Sign Up
                                </h2>

                                <p className="mt-1 text-center text-xs text-slate-500">
                                    Please fill in the details below to create
                                    your account.
                                </p>

                                <form
                                    className="mt-8 space-y-4"
                                    onSubmit={handleSubmit}
                                >
                                    <div>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="First Name"
                                            className="h-11 w-full rounded border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.firstName}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last Name"
                                            className="h-11 w-full rounded border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.lastName}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email Address"
                                            autoComplete="email"
                                            className="h-11 w-full rounded border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            autoComplete="new-password"
                                            className="h-11 w-full rounded border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm Password"
                                            autoComplete="new-password"
                                            className="h-11 w-full rounded border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                                        />
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded bg-slate-50 px-4 py-3 text-xs text-slate-500">
                                        Password must be at least 8 characters
                                        and include uppercase, lowercase,
                                        number, and special character.
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-1 h-11 w-full cursor-pointer rounded bg-pink-600 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-200 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {loading
                                            ? 'Creating Account...'
                                            : 'Sign Up'}
                                    </button>

                                    <p className="pt-3 text-center text-xs text-slate-500">
                                        Already have an account?
                                        <Link
                                            to="/login"
                                            className="ml-1 text-slate-600 hover:text-pink-600"
                                        >
                                            Login
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

export default Signup