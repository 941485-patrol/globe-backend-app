import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate =
    (schema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                const zodError = error as ZodError;
                return res.status(422).json({
                    message: 'Validation failed.',
                    errors: zodError.issues,
                });
            }

            if (error instanceof Error) {
                return next(error);
            }
            return next(new Error('An unexpected error occurred.'));
        }
    };
