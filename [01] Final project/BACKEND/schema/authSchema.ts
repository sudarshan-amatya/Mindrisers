import { z } from 'zod'

export const registerSchema = z.object({
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

    email: z
        .email('Please enter a valid email address')
        .transform((value) => value.toLowerCase().trim()),

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
})

export const loginSchema = z.object({
    email: z
        .email('Please enter a valid email address')
        .transform((value) => value.toLowerCase().trim()),
    password: z.string().min(1, 'Password is required'),
})