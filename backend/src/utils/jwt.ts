import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import logger from '../config/logger.js';
import type { StringValue } from "ms";

export interface JwtPayload {
    userId: string;
    email: string;
}

// --- Generate JWT Token ---
export const generateToken = ({ userId, email }: JwtPayload) => {
    return jwt.sign(
        {
            userId,
            email
        },
        env.JWT_ACCESS_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRES_IN  as StringValue }
    )
}

// --- Verifies the incoming token against secret ---
export const verifyToken = (token: string): JwtPayload => {
    try {

        return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`JWT verification failed: ${error.message}`);
        } else {
            logger.error("JWT verification failed.");
        }

        throw error;
    }
}