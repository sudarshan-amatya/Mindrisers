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

function SellerRequests() {
    const [users, setUsers] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<number | string | null>(null)

    const token = localStorage.getItem('accessToken')

    const fetchRequests = async () => {
        if (!token) return

        try {
            setLoading(true)

            const res = await axios.get(
                'http://localhost:3000/api/admin/users/seller-requests',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setUsers(res.data.data || [])
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to fetch seller requests'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const handleAction = async (
        id: number | string,
        action: 'approve' | 'reject'
    ) => {
        if (!token) return

        try {
            setUpdatingId(id)

            const res = await axios.patch(
                `http://localhost:3000/api/admin/users/${id}/seller-request`,
                { action },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            toast.success(res.data.message || 'Request updated successfully')
            setUsers((prev) => prev.filter((user) => user.id !== id))
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to update request'
            )
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <section className="min-h-screen bg-[#F6F7FB]">
            <div className="container py-8 md:py-10">
                <div className="mb-8">
                    <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2.5rem)] font-bold text-[#151875]">
                        Seller Requests
                    </h1>
                    <p className="mt-1 text-sm text-[#8A8FB9]">
                        Approve or reject seller access requests.
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    {loading ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
                            No pending seller requests.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 text-sm text-[#8A8FB9]">
                                        <th className="pb-3 font-medium">Name</th>
                                        <th className="pb-3 font-medium">Email</th>
                                        <th className="pb-3 font-medium">Phone</th>
                                        <th className="pb-3 font-medium">Address</th>
                                        <th className="pb-3 text-right font-medium">
                                            Actions
                                        </th>
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
                                            <td className="py-4 text-sm text-slate-600">
                                                {user.address || 'N/A'}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            updatingId === user.id
                                                        }
                                                        onClick={() =>
                                                            handleAction(
                                                                user.id,
                                                                'approve'
                                                            )
                                                        }
                                                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-70"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            updatingId === user.id
                                                        }
                                                        onClick={() =>
                                                            handleAction(
                                                                user.id,
                                                                'reject'
                                                            )
                                                        }
                                                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
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

export default SellerRequests