import fs from 'fs';
import path from 'path';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// import { getIo } from '../socket.js';
import Task from '../models/task.js';
import User from '../../user/models/user.js';
// import User from '../models/user.js';
import GetTasks from '../services/getTasks.js';
import CreateTask from '../services/createTask.js';
import GetTask from '../services/getTask.js';
import UpdateTask from '../services/updateTask.js';
import DeleteTask from '../services/deleteTask.js';

interface AppError extends Error {
    statusCode?: number;
    data?: unknown;
}

interface AuthRequest extends Request {
    userId?: string;
}

export const getTasks: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const getTasks = new GetTasks(Task);
    getTasks.handle(req, res, next);
};

export const createTask: RequestHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const createTask = new CreateTask(Task, User);
    createTask.handle(req, res, next);
};

export const getTask: RequestHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const getTask = new GetTask(Task);
    getTask.handle(req, res, next);
};

export const updateTask: RequestHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const updateTask = new UpdateTask(Task);
    updateTask.handle(req, res, next);
};

export const deleteTask: RequestHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const deleteTask = new DeleteTask(Task, User);
    deleteTask.handle(req, res, next);
};
