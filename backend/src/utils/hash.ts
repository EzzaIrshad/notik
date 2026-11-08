import bcrypt from 'bcrypt'
import logger from '../config/logger.js';

// --- Hashes plain password before saving to the database ---
export const hashPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Password hash failed: ${error.message}`);
        } else {
            logger.error("Password hash failed.");
        }

        throw error;
    }
}

// --- compares a plain password against the stored hash during login ---
export const matchPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}