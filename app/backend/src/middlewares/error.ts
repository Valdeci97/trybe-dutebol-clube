import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/httpException';

export default function errorMiddleware(
  err: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const code = err.status || 500;
  const message = err.message || 'Something went wrong';
  return res.status(code).send({ message });
}
