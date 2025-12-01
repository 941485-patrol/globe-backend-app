import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import * as taskController from '../controllers/task.js';
import authorize from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { taskSchema } from '../validators/task.js';

const router = express.Router();

router.get(
    '/tasks',
    authorize,
    taskController.getTasks
);

router.post(
    '/task',
    authorize,
    validate(taskSchema),
    taskController.createTask,
);

router.get('/task/:taskId',
    authorize,
    taskController.getTask
);

router.put(
    '/task/:taskId',
    authorize,
    validate(taskSchema),
    taskController.updateTask,
);

router.delete(
    '/task/:taskId',
    authorize,
    taskController.deleteTask,
);

export default router;
