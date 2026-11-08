import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const validateObjectId = (paramName: string) => (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid note ID."
        });
    }

    next();
}