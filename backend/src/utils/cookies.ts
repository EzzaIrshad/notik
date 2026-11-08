import { Response } from "express";
import { env } from "../config/env.js";

const COOKIE_NAME = env.COOKIE_NAME;

const COOKIE_OPTIONS = {
    httpOnly: true,                         // Prevents frontend JS from reading the cookie
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,               // Protects against CSRF attacks
    maxAge: 24 * 60 * 60 * 1000,            // 1 day expiration window
};

export const setAuthCookie = (res: Response, token: string) => {
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
};

export const clearAuthCookie = (res: Response) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
    });
};