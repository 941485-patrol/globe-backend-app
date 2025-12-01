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

class UpdateUserStatus {

    userModel: Model<UserInterface>;

    constructor(userModel: Model<UserInterface>) {
        this.userModel = userModel;
    }

    public async handle(req: AuthRequest, res: Response, next: NextFunction) {
        const newStatus = req.body.status;

        try {
            const user: UserInterface | null = await User.findById(req.userId);

            if (!user) {
                const error: AppError = new Error('User not found.');
                error.statusCode = 404;
                throw error;
            }

            user.status = newStatus;

            await user.save();

            res.status(200).json({ message: 'User updated.' });
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

export default UpdateUserStatus;