import { string, z } from 'zod'

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters.' })
    .max(500, {message: 'Content should not be more than 500 characters.'})
})
