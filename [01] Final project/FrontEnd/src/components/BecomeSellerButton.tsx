import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import type { RootState } from '../redux/store'
import { login } from '../redux/slice/userSlice'
import { useState } from 'react'

function RequestSellerButton() {
    const dispatch = useDispatch()
    const user = useSelector((root: RootState) => root.user.data)
    const [loading, setLoading] = useState(false)

    const handleRequestSeller = async () => {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            toast.error('Please login first')
            return
        }

        try {
            setLoading(true)

            const res = await axios.post(
                'http://localhost:3000/api/users/request-seller',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (user) {
                dispatch(
                    login({
                        ...user,
                        sellerRequestStatus: 'pending',
                    })
                )
            }

            toast.success(
                res.data.message || 'Seller request submitted successfully'
            )
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Failed to submit request'
            )
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null
    if (user.isAdmin) return null
    if (user.isSeller) return null
    if (user.sellerRequestStatus === 'pending') {
        return (
            <div className="rounded-md bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                Your seller request is pending approval.
            </div>
        )
    }

    if (user.sellerRequestStatus === 'rejected') {
        return (
            <div className="space-y-3">
                <div className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    Your seller request was rejected.
                </div>
                <button
                    type="button"
                    onClick={handleRequestSeller}
                    disabled={loading}
                    className="rounded bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:opacity-70"
                >
                    {loading ? 'Submitting...' : 'Request Again'}
                </button>
            </div>
        )
    }

    return (
        <button
            type="button"
            onClick={handleRequestSeller}
            disabled={loading}
            className="cursor-pointer rounded bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:opacity-70"
        >
            {loading ? 'Submitting...' : 'Become a Seller'}
        </button>
    )
}

export default RequestSellerButton
