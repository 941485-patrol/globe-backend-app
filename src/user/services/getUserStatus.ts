import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import User, { UserInterface } from '../models/user.js';

interface AppError extends Error {
    statusCode?: number;
    data?: unknown;
}

interface AuthRequest extends Request {
    userId?: string;
}

class GetUserStatus {

    userModel: Model<UserInterface>;

    constructor(userModel: Model<UserInterface>) {
        this.userModel = userModel;
    }

    public async handle(req: AuthRequest, res: Response, next: NextFunction) {

        try {
            const user: UserInterface | null = await User.findById(req.userId);
            if (!user) {
                const error: AppError = new Error('User not found.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ status: user.status });
        } catch (err: unknown) {
            if (typeof err === 'object' && err !== null && 'statusCode' in err) {
                if (!(err as AppError).statusCode) {
                    (err as AppError).statusCode = 500;
                }
                next(err);
            } else {
                const error: AppError = new Error('An unknown error occurred');
                error.statusCode = 500;
                next(error);
            }
        }
    }
}

export default GetUserStatus;