import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default function checkAuthentication(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Authorization header missing',
      });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        message: 'Invalid authorization format',
      });
    }

    const secret = process.env.JWT_SECRETKEY;

    if (!secret) {
      return res.status(500).json({
        message: 'JWT secret is not configured',
      });
    }

    const decoded = jwt.verify(token, secret);

    return next();
  } catch (error) {
    return next(error);
  }
}