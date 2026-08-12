import { z } from 'zod'
import User from '../models/User'

const updateProfileSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name is too long'),

    lastName: z
        .string()
        .trim()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name is too long'),

    phone: z
        .string()
        .trim()
        .min(7, 'Phone number is too short')
        .max(20, 'Phone number is too long')
        .optional()
        .or(z.literal('')),

    address: z
        .string()
        .trim()
        .min(5, 'Address must be at least 5 characters')
        .max(500, 'Address is too long')
        .optional()
        .or(z.literal('')),
})

const userService = {
    getProfile: async (userId: number | string) => {
        const user = await User.findByPk(userId)

        if (!user) {
            const error = new Error('User not found')
            ;(error as any).statusCode = 404
            throw error
        }

        const userData = user.toJSON() as any

        return {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            isSeller: userData.isSeller,
            phone: userData.phone,
            address: userData.address,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
        }
    },

    updateProfile: async (userId: number | string, body: unknown) => {
        const result = updateProfileSchema.safeParse(body)

        if (!result.success) {
            const error = new Error('Validation failed')
            ;(error as any).statusCode = 400
            ;(error as any).errors = z.flattenError(result.error).fieldErrors
            throw error
        }

        const user = await User.findByPk(userId)

        if (!user) {
            const error = new Error('User not found')
            ;(error as any).statusCode = 404
            throw error
        }

        const { firstName, lastName, phone, address } = result.data

        await User.update(
            {
                firstName,
                lastName,
                phone: phone || null,
                address: address || null,
            },
            {
                where: { id: userId },
            }
        )

        const updatedUser = await User.findByPk(userId)

        if (!updatedUser) {
            const error = new Error('User not found after update')
            ;(error as any).statusCode = 404
            throw error
        }

        const userData = updatedUser.toJSON() as any

        return {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            isSeller: userData.isSeller,
            phone: userData.phone,
            address: userData.address,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
        }
    },
}

export default userService