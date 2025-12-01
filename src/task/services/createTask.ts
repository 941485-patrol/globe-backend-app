import { Request, Response, NextFunction } from 'express';
import { Model, Types } from 'mongoose';
import { TaskInterface } from '../models/task.js';
import { UserInterface } from '../../user/models/user.js';
import { validationResult } from 'express-validator';
import { getIo } from '../../socket.js';

interface AppError extends Error {
    statusCode?: number;
    data?: unknown;
}

interface AuthRequest extends Request {
    userId?: string;
}

class CreateTask {
    taskModel: Model<TaskInterface>;
    userModel: Model<UserInterface>;

    constructor(taskModel: Model<TaskInterface>, userModel: Model<UserInterface>) {
        this.taskModel = taskModel;
        this.userModel = userModel;
    }

    public async handle(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res
                    .status(422)
                    .json({ message: 'Validations failed', errors: errors.array() });
            }

            const title = req.body.title;
            const description = req.body.description;

            const task: TaskInterface = new this.taskModel({
                title: title,
                description: description,
                user: new Types.ObjectId(req.userId),
            });

            await task.save();

            const user: UserInterface | null = await this.userModel.findById(req.userId);

            if (!user) {
                const error: AppError = new Error('User not found.');
                error.statusCode = 404;
                throw error;
            }

            user.tasks.push(task);

            await user.save();

            getIo().emit('tasks', {
                action: 'create',
                task: {
                    ...task.toObject(),
                    user: { _id: req.userId, name: user.name },
                },
            });

            return res.status(201).json({
                message: 'Task created.',
                task: task,
                user: { _id: user._id, name: user.name },
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

export default CreateTask;
