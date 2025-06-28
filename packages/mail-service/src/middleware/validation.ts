import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import pino from 'pino';

const logger = pino({ level: 'info' });

export const emailRequestSchema = z.object({
  to: z.object({
    email: z.string().email('Invalid email address.'),
    name: z.string().min(1, 'Name is required.'),
  }),
  from: z.object({
    email: z.string().email('Invalid email address.'),
    name: z.string().min(1, 'Name is required.'),
  }),
  subject: z.string().min(1, 'Subject is required.'),
  html: z.string().min(1, 'HTML content is required.'),
  text: z.string().min(1, 'Text content is required.'),
  template: z.string().optional(),
  vars: z.record(z.unknown()).optional(),
});

export const validateEmailRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    emailRequestSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn({ msg: 'Invalid email request body', errors: error.errors });
      res.status(400).json({
        message: 'Invalid request body.',
        errors: error.flatten().fieldErrors,
      });
    } else {
      logger.error({ msg: 'Unexpected validation error', error });
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
