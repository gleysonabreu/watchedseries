import AppError from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';

async function checkImageWasSent(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (!request.file) throw new AppError('You need to upload an image.');
  next();
}

export default checkImageWasSent;
