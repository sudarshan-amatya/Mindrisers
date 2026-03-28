import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { loginSchema, registerSchema } from '../schema/authSchema'

const authService = {
  signup: async (body: unknown) => {
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      const error = new Error('Validation failed')
      ;(error as any).statusCode = 400
      ;(error as any).errors = z.flattenError(result.error).fieldErrors
      throw error
    }

    const { firstName, lastName, email, password } = result.data

    const existingUser = await User.findOne({
      where: { email },
    })

    if (existingUser) {
      const error = new Error('Email already exists')
      ;(error as any).statusCode = 400
      throw error
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })

    const userData = user.toJSON()

    return {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
    }
  },

  login: async (body: unknown) => {
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      const error = new Error('Validation failed')
      ;(error as any).statusCode = 400
      ;(error as any).errors = z.flattenError(result.error).fieldErrors
      throw error
    }

    const { email, password } = result.data

    const user = await User.findOne({
      where: { email },
    })

    if (!user) {
      const error = new Error('Invalid email or password')
      ;(error as any).statusCode = 401
      throw error
    }

    const userData = user.toJSON()

    const isPasswordValid = await bcrypt.compare(password, userData.password)

    if (!isPasswordValid) {
      const error = new Error('Invalid email or password')
      ;(error as any).statusCode = 401
      throw error
    }

    const secret = process.env.JWT_SECRETKEY

    if (!secret) {
      throw new Error('JWT secret is not configured')
    }

    const payload = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
    }

    const token = jwt.sign(payload, secret, {
      expiresIn: '1d',
    })

    return {
      ...payload,
      token,
    }
  },
}

export default authService