import { z } from 'zod';

export const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, "Full name is required.")
        .min(2, "Full name must be at least 2 characters.")
        .max(50, "Full name cannot exceed 50 characters."),
    email: z
        .string()
        .min(1, "Email is required.")
        .pipe(z.email("Please enter a valid email address")),
    password: z
        .string()
        .min(1, "Password is required.")
        .min(8, "Password must be at least 8 characters."),
});

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required.")
        .pipe(z.email("Please enter a valid email address")),
    password: z
        .string()
        .min(1, "Password is required.")
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;