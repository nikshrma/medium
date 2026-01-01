import type { NextFunction, Request, Response } from "express";
import jwt, { type Secret } from "jsonwebtoken";

export function authCheck(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(403).json({
            message: "Invalid request. No token found."
        })
    }
    const token = auth?.split(" ")[1];
    try {
        const decoded = jwt.verify(token as string, process.env.JWT_PASS as Secret);
        if (typeof decoded === "string" || !("userId" in decoded)) {
            return res.status(403).json({
                message: "Invalid token."
            })
        }
        (req as any).userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid token"
        })
    }
}