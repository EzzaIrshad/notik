import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt.js';
import logger from '../config/logger.js';
import { env } from '../config/env.js';

// --- Express middleware to guard protected routes via JWT validation ---
export const protect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.[env.COOKIE_NAME];

    if (!token) {
        logger.warn("Authentication cookie missing.");

        return res.status(401).json({
            message: "Authentication required.",
        });
    }
    try {

        const decoded = verifyToken(token);

        // Attach user payload to the request
        req.user = decoded;
        next();
    } catch (error) {
        logger.error(`Token Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};