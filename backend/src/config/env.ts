import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number().int().min(1).max(65535).default(5000),
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters long"),
    JWT_ACCESS_EXPIRES_IN: z.string().regex(/^(\d+)(ms|s|m|h|d|w|y)?$/, "Invalid JWT_ACCESS_EXPIRES_IN format"),
    CLIENT_ORIGIN: z.url(),
    COOKIE_NAME: z.string().min(1, "COOKIE_NAME is required").regex(/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/,"COOKIE_NAME contains invalid characters"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);