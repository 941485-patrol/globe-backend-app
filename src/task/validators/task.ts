import { z } from 'zod';

export const taskSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .min(5, { message: 'Title must be at least 5 characters long' }),
        description: z
            .string()
            .trim()
            .min(5, { message: 'Description must be at least 5 characters long' }),
    }),
});

// Validate request parameters
export const taskIdSchema = z.object({
    params: z.object({
        taskId: z.string().refine((val: string) => /^[0-9a-fA-F]{24}$/.test(val), {
            message: 'Invalid task ID format',
        }),
    }),
});
