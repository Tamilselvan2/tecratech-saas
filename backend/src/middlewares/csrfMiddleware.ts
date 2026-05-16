import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const verifyCsrfHeader = (req: Request, res: Response, next: NextFunction) => {
  const csrfToken = req.headers['x-csrf-token'];

  if (typeof csrfToken !== 'string' || csrfToken.trim().length === 0) {
    next(new AppError(403, 'CSRF token missing or invalid'));
    return;
  }

  next();
};
