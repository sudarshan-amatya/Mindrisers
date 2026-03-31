import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

type UserType = {
    id: number | string
    firstName: string
    lastName: string
    email: string
    isSeller: boolean
    isAdmin: boolean
    sellerRequestStatus: 'none' | 'pending' | 'approved' | 'rejected'
    phone?: string | null
    address?: string | null
    createdAt?: string
}

function AdminUsers() {
    const [users, setUsers] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem('accessToken')

    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) {
                toast.error('Please login first')
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                const res = await axios.get(
                    'http://localhost:3000/api/admin/users',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                setUsers(res.data.data || [])
            } catch (error: any) {
                toast.error(
                    error?.response?.data?.message || 'Failed to fetch users'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [token])

    const getRoleBadge = (user: UserType) => {
        if (user.isAdmin) {
            return 'bg-purple-50 text-purple-600'
        }

        if (user.isSeller) {
            return 'bg-green-50 text-green-600'
        }

        return 'bg-slate-100 text-slate-600'
    }

    const getRoleLabel = (user: UserType) => {
        if (user.isAdmin) return 'Admin'
        if (user.isSeller) return 'Seller'
        return 'Buyer'
    }

    const getRequestBadge = (status: UserType['sellerRequestStatus']) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-50 text-amber-600'
            case 'approved':
                return 'bg-green-50 text-green-600'
            case 'rejected':
                return 'bg-red-50 text-red-600'
            default:
                return 'bg-slate-100 text-slate-600'
        }
    }

    return (
        <section className="min-h-screen bg-[#F6F7FB]">
            <div className="container py-8 md:py-10">
                <div className="mb-8">
                    <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2.5rem)] font-bold text-[#151875]">
                        Admin Users
                    </h1>
                    <p className="mt-1 text-sm text-[#8A8FB9]">
                        View all users and their account roles.
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    {loading ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
                            No users found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 text-sm text-[#8A8FB9]">
                                        <th className="pb-3 font-medium">Name</th>
                                        <th className="pb-3 font-medium">Email</th>
                                        <th className="pb-3 font-medium">Phone</th>
                                        <th className="pb-3 font-medium">Role</th>
                                        <th className="pb-3 font-medium">
                                            Seller Request
                                        </th>
                                        <th className="pb-3 font-medium">Joined</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-slate-50 last:border-0"
                                        >
                                            <td className="py-4 text-sm font-medium text-[#151875]">
                                                {user.firstName} {user.lastName}
                                            </td>

                                            <td className="py-4 text-sm text-slate-600">
                                                {user.email}
                                            </td>

                                            <td className="py-4 text-sm text-slate-600">
                                                {user.phone || 'N/A'}
                                            </td>

                                            <td className="py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleBadge(
                                                        user
                                                    )}`}
                                                >
                                                    {getRoleLabel(user)}
                                                </span>
                                            </td>

                                            <td className="py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${getRequestBadge(
                                                        user.sellerRequestStatus
                                                    )}`}
                                                >
                                                    {user.sellerRequestStatus}
                                                </span>
                                            </td>

                                            <td className="py-4 text-sm text-slate-600">
                                                {user.createdAt
                                                    ? new Date(
                                                          user.createdAt
                                                      ).toLocaleDateString()
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default AdminUsers