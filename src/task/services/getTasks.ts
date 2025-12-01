import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { TaskInterface } from '../models/task.js';

interface AppError extends Error {
    statusCode?: number;
    data?: unknown;
}

class GetTasks {
    taskModel: Model<TaskInterface>;

    constructor(taskModel: Model<TaskInterface>) {
        this.taskModel = taskModel;
    }

    public async handle(req: Request, res: Response, next: NextFunction) {

        // Convert page query param to a number.
        const currentPage: number = typeof req.query.page === 'string' ? +req.query.page : 1;

        const perPage: string | number = process.env.PERPAGE ? +process.env.PERPAGE : 2;

        try {

            const totalItems = await this.taskModel.find().countDocuments();

            const tasks = await this.taskModel
                .find()
                .populate('user', 'name _id')
                .sort({ createdAt: 'desc', _id: "desc" })
                .skip((currentPage - 1) * perPage)
                .limit(perPage);

            if (tasks.length === 0) {
                const error: AppError = new Error('No tasks found.');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                message: 'Fetched tasks.',
                tasks: tasks,
                totalItems: totalItems,
            });
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

export default GetTasks;
