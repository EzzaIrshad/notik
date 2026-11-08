import { z } from 'zod'

export const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters.")
        .max(50, "Full name cannot exceed 50 characters."),
    email: z.email("Email is required."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters."),
})

export const loginSchema = z.object({
    email: z.email("Email is required."),
    password: z
        .string()
        .min(1, "Password is required."),
})

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;