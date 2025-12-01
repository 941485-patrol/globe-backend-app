import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { TaskInterface } from "../models/task.js";

interface AppError extends Error {
    statusCode?: number;
    data?: unknown;
}

interface AuthRequest extends Request {
    userId?: string;
}

class GetTask {

    taskModel: Model<TaskInterface>;

    constructor(taskModel: Model<TaskInterface>) {
        this.taskModel = taskModel;
    }

    public async handle(req: AuthRequest, res: Response, next: NextFunction) {

        const taskId = req.params.taskId;

        try {
            const task = await this.taskModel.findById(taskId).populate('user', 'name _id');

            if (!task) {
                const error: AppError = new Error('Could not find task');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Task fetched.', task: task });
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

export default GetTask;