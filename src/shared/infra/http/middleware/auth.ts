import { Request, Response, NextFunction } from 'express';
import { verify } from '@shared/services/auth';
import AppError from '@shared/errors/AppError';

interface IToken {
  payload: {
    id: string;
    username: string;
  };
}

async function auth(request: Request, response: Response, next: NextFunction) {
  const { authorization } = request.headers;
  if (!authorization) throw new AppError('No token provided', 401);

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') throw new AppError('Invalid bearer', 401);

  try {
    const tokenData = <IToken>verify(token);
    request.userId = tokenData.payload.id;
    request.username = tokenData.payload.username;

    return next();
  } catch (err) {
    throw new AppError('Token invalid', 401);
  }
}

export default auth;
