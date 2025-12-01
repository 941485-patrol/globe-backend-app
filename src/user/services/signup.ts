import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User, { UserInterface } from '../models/user.js';

interface AppError extends Error {
    statusCode?: number;
    data?: unknown;
}

class SignUp {
    userModel: Model<UserInterface>;

    constructor(userModel: Model<UserInterface>) {
        this.userModel = userModel;
    }

    public async handle(req: Request, res: Response, next: NextFunction) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error: AppError = new Error('User validation failed');
            error.statusCode = 422;
            error.data = errors.array();
            return next(error);
        }

        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;

        try {
            const hashedPassword = await bcrypt.hash(password, 12);

            const user: UserInterface = new User({
                email: email,
                password: hashedPassword,
                name: name,
            });

            const result = await user.save();

            res.status(201).json({ message: 'User created succesfully.', userId: result._id });

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

export default SignUp;