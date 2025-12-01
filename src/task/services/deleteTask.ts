import { Request, Response, NextFunction } from 'express';
import { Model, Types } from 'mongoose';
import { TaskInterface } from '../models/task.js';
import { UserInterface } from '../../user/models/user.js';
import { getIo } from '../../socket.js';

interface AppError extends Error {
    statusCode?: number;
    data?: unknown;
}

interface AuthRequest extends Request {
    userId?: string;
}

class DeleteTask {
    taskModel: Model<TaskInterface>;
    userModel: Model<UserInterface>;

    constructor(taskModel: Model<TaskInterface>, userModel: Model<UserInterface>) {
        this.taskModel = taskModel;
        this.userModel = userModel;
    }

    public async handle(req: AuthRequest, res: Response, next: NextFunction) {
        const taskId = req.params.taskId;

        try {
            const task = await this.taskModel.findById(taskId);

            if (!task) {
                const error: AppError = new Error('Could not find task');
                error.statusCode = 404;
                throw error;
            }

            if (task.user.toString() !== req.userId) {
                const error: AppError = new Error('User not authorized.');
                error.statusCode = 403;
                throw error;
            }

            await this.taskModel.findByIdAndDelete(taskId);

            const user = await this.userModel.findById(req.userId);

            if (user) {
                user.tasks.pull(taskId);
                await user.save();
            }

            getIo().emit('tasks', { action: 'delete', task: taskId });

            res.status(200).json({ message: 'Task deleted.' });

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

export default DeleteTask;
