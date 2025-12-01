import { RequestHandler, Request, Response, NextFunction } from 'express';
import User, { UserInterface } from '../models/user.js';
import SignUp from '../services/signup.js';
import LogIn from '../services/login.js';
import GetUserStatus from '../services/getUserStatus.js';
import UpdateUserStatus from '../services/updateUserStatus.js';

export const signup: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const signUp = new SignUp(User);
    await signUp.handle(req, res, next);
};

export const login: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const login = new LogIn(User);
    await login.handle(req, res, next);
}

export const getUserStatus: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const getUserStatus = new GetUserStatus(User);
    await getUserStatus.handle(req, res, next)
}

export const updateUserStatus: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const updateUserStatus = new UpdateUserStatus(User);
    await updateUserStatus.handle(req, res, next)
}