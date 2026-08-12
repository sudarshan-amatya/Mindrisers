import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router'
import { Edit, Mail, MapPin, Phone, UserCircle } from 'lucide-react'

type ProfileType = {
    id: number | string
    firstName: string
    lastName: string
    email: string
    isSeller: boolean
    phone?: string | null
    address?: string | null
    createdAt?: string
    updatedAt?: string
}

function Profile() {
    const [profile, setProfile] = useState<ProfileType | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('accessToken')

            if (!token) {
                toast.error('Please login first')
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                const res = await axios.get(
                    'http://localhost:3000/api/users/profile',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                setProfile(res.data.data)
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message || 'Failed to fetch profile'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    if (loading) {
        return (
            <section className="min-h-screen bg-[#F6F7FB]">
                <div className="container py-8 md:py-10">
                    <div className="flex min-h-[60vh] items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
                    </div>
                </div>
            </section>
        )
    }

    if (!profile) {
        return (
            <section className="min-h-screen bg-[#F6F7FB]">
                <div className="container py-8 md:py-10">
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                        <p className="text-center text-slate-600">
                            Profile not found.
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="min-h-screen bg-[#F6F7FB]">
            <div className="container py-8 md:py-10">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2.5rem)] font-bold text-[#151875]">
                            My Profile
                        </h1>
                        <p className="mt-1 text-sm text-[#8A8FB9]">
                            View and manage your personal information.
                        </p>
                    </div>

                    <Link
                        to="/profile/edit"
                        className="inline-flex items-center gap-2 rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700"
                    >
                        <Edit size={18} />
                        Edit Profile
                    </Link>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-pink-50 text-pink-600">
                            <UserCircle size={56} />
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-2xl font-bold text-[#151875]">
                                    {profile.firstName} {profile.lastName}
                                </h2>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        profile.isSeller
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-slate-100 text-slate-600'
                                    }`}
                                >
                                    {profile.isSeller ? 'Seller' : 'Buyer'}
                                </span>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl bg-[#F8F9FD] p-4">
                                    <div className="flex items-center gap-2 text-pink-600">
                                        <Mail size={18} />
                                        <span className="text-sm font-medium text-[#151875]">
                                            Email
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {profile.email}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#F8F9FD] p-4">
                                    <div className="flex items-center gap-2 text-pink-600">
                                        <Phone size={18} />
                                        <span className="text-sm font-medium text-[#151875]">
                                            Phone
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {profile.phone || 'No phone added'}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#F8F9FD] p-4 sm:col-span-2">
                                    <div className="flex items-center gap-2 text-pink-600">
                                        <MapPin size={18} />
                                        <span className="text-sm font-medium text-[#151875]">
                                            Address
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        {profile.address || 'No address added'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 text-xs text-slate-500">
                                Joined:{' '}
                                {profile.createdAt
                                    ? new Date(profile.createdAt).toLocaleDateString()
                                    : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Profile