import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import AppError from './AppError';

const AppHandleError: ErrorRequestHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'Error',
      message: error.message,
    });
  }

  console.log(error);

  return response.status(500).json({
    status: 'Error',
    message: 'Internal Server Error',
  });
};

export default AppHandleError;
