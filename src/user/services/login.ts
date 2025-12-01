import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import User, { UserInterface } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


interface AppError extends Error {
    statusCode?: number;
    data?: unknown;
}

class LogIn {

    userModel: Model<UserInterface>;

    constructor(userModel: Model<UserInterface>) {
        this.userModel = userModel;
    }

    public async handle(req: Request, res: Response, next: NextFunction) {

        const email = req.body.email;
        const password = req.body.password;

        try {

            const user: UserInterface | null = await User.findOne({ email: email });

            if (!user) {
                const error: AppError = new Error('Email not found.');
                error.statusCode = 401;
                throw error;
            }

            const isEqual = await bcrypt.compare(password, user.password);

            if (!isEqual) {
                const error: AppError = new Error('Wrong password.');
                error.statusCode = 401;
                throw error;
            }

            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id.toString(),
                },
                process.env.SUPERSECRET!,
                { expiresIn: '1h' },
            );

            res.status(200).json({ token: token, userId: user._id.toString() });

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

export default LogIn;