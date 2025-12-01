import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AppError extends Error {
    statusCode?: number;
}

interface AuthRequest extends Request {
    userId?: string;
}

interface DecodedToken {
    userId: string;
}

const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {

    const authHeader = req.get('Authorization');

    // User is not logged in.
    if (!authHeader) {
        const error: AppError = new Error('Not authenticated.');
        error.statusCode = 401;
        return next(error);
    }

    const token = authHeader.split(' ')[1];

    // There is no JWT token present.
    if (!token) {
        const error: AppError = new Error('Token missing.');
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token, process.env.SUPERSECRET!);
        if (typeof decoded !== 'object' || decoded === null || !('userId' in decoded)) {
            const error: AppError = new Error('Invalid JWT payload.');
            error.statusCode = 401;
            return next(error);
        }

        // Convert decoded constant as a type of DecodedToken.
        req.userId = (decoded as DecodedToken).userId;

        next();
    } catch (err: unknown) {
        const error: AppError = new Error('JWT verification failed.');
        error.statusCode = 500;
        return next(error);
    }
};

export default authMiddleware;