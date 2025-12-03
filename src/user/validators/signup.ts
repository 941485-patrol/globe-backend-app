import User from '../models/user.js';
import { z } from 'zod';

export const signUpSchema = z.object({
    body: z.object({
        email: z
            .email({ message: "Please enter an email." })
            .transform((value) => { return value.toLowerCase().trim() })
            .refine(async (value) => {
                const userDoc = await User.findOne({ email: value })
                return !userDoc;
            }, { message: "Email already exists." }),
        password: z
            .string()
            .min(5, { message: 'Password must be at least 5 characters long.' })
            .trim(),
        name: z
            .string()
            .min(1, { message: "Name is required." })
            .trim()
    })
});