import { z } from 'zod'

export const usernameVerification = z
  .string()
  .min(4, 'Minium 4 characters are required')
  .max(20, 'Maximum 20 characters are required')
  .regex(/^[a-zA-Z0-9_]+$/, 'User should not contains specail characters')

export const signUpSchema = z.object({
  username: usernameVerification,
  email: z.string().email({message: 'Invalid email address.'}),
  password: z.string().min(8, {message: 'Password must be minimum 8 characters.'})
})