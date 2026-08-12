import User from '../models/User'
import { z } from 'zod'

const updateSellerRequestSchema = z.object({
    action: z.enum(['approve', 'reject']),
})

const adminUserService = {
    getSellerRequests: async () => {
        return await User.findAll({
            where: {
                sellerRequestStatus: 'pending',
            },
            order: [['createdAt', 'DESC']],
        })
    },

    getAllUsers: async () => {
        return await User.findAll({
            order: [['createdAt', 'DESC']],
        })
    },

    updateSellerRequest: async (id: string, body: unknown) => {
        const result = updateSellerRequestSchema.safeParse(body)

        if (!result.success) {
            const error = new Error('Validation failed')
            ;(error as any).statusCode = 400
            ;(error as any).errors = z.flattenError(result.error).fieldErrors
            throw error
        }

        const { action } = result.data

        const user = await User.findByPk(id)

        if (!user) {
            const error = new Error('User not found')
            ;(error as any).statusCode = 404
            throw error
        }

        const userData = user.toJSON() as any

        if (userData.sellerRequestStatus !== 'pending') {
            const error = new Error('No pending seller request for this user')
            ;(error as any).statusCode = 400
            throw error
        }

        if (action === 'approve') {
            await User.update(
                {
                    isSeller: true,
                    sellerRequestStatus: 'approved',
                },
                {
                    where: { id },
                }
            )
        } else {
            await User.update(
                {
                    isSeller: false,
                    sellerRequestStatus: 'rejected',
                },
                {
                    where: { id },
                }
            )
        }

        return await User.findByPk(id)
    },
}

export default adminUserService