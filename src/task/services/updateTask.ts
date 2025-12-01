import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { TaskInterface } from '../models/task.js';
import { validationResult } from 'express-validator';
import { getIo } from '../../socket.js';

interface AppError extends Error {
    statusCode?: number;
    data?: unknown;
}

interface AuthRequest extends Request {
    userId?: string;
}

class UpdateTask {

    taskModel: Model<TaskInterface>;

    constructor(taskModel: Model<TaskInterface>) {
        this.taskModel = taskModel;
    }

    public async handle(req: AuthRequest, res: Response, next: NextFunction) {

        const taskId = req.params.taskId;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ message: 'Validations failed', errors: errors.array() });
        }

        const title = req.body.title;
        const description = req.body.description;

        try {
            const task = await this.taskModel.findById(taskId);

            if (!task) {
                const error: AppError = new Error('Could not find task.');
                error.statusCode = 404;
                throw error;
            }

            if ('user' in task && task.user._id.toString() !== req.userId) {
                const error: AppError = new Error('User is not authorized.');
                error.statusCode = 403;
                throw error;
            }

            task.title = title;
            task.description = description;
            const result = await task.save();

            getIo().emit('tasks', { action: 'update', task: result });

            res.status(200).json({ message: 'Task updated.', task: result });

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

export default UpdateTask;
