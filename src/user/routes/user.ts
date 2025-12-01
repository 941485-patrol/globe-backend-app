import express from 'express';
import * as userController from '../controllers/user.js';
import { signUpSchema } from '../validators/signup.js';
import { validate } from '../../middlewares/validate.js';

const router = express.Router();

router.post(
    '/signup',
    validate(signUpSchema),
    userController.signup,
);

router.post(
    '/login',
    userController.login
);

export default router;
