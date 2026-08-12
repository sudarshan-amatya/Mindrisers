import { Request, Response, NextFunction } from 'express'
import {
  UniqueConstraintError,
  ValidationError,
  ForeignKeyConstraintError,
  UnknownConstraintError,
  DatabaseError,
  TimeoutError,
  ConnectionError,
  EmptyResultError,
  EagerLoadingError,
  OptimisticLockError,
} from 'sequelize'
import {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken'

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  if (error instanceof UniqueConstraintError) {
    return res.status(400).json({
      message: 'Unique constraint failed',
      errors: error.errors.map((el: any) => ({
        field: el.path,
        message: el.message,
      })),
    })
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.errors.map((el: any) => ({
        field: el.path,
        message: el.message,
      })),
    })
  }

  if (error instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      message: 'Foreign key constraint failed',
    })
  }

  if (error instanceof UnknownConstraintError) {
    return res.status(400).json({
      message: 'Unknown constraint error',
    })
  }

  if (error instanceof EmptyResultError) {
    return res.status(404).json({
      message: 'Resource not found',
    })
  }

  if (error instanceof EagerLoadingError) {
    return res.status(400).json({
      message: 'Invalid include or relation',
    })
  }

  if (error instanceof OptimisticLockError) {
    return res.status(409).json({
      message: 'Conflict while updating resource',
    })
  }

  if (error instanceof TokenExpiredError) {
    return res.status(401).json({
      message: 'Token expired',
    })
  }

  if (error instanceof NotBeforeError) {
    return res.status(401).json({
      message: 'Token not active yet',
    })
  }

  if (error instanceof JsonWebTokenError) {
    return res.status(401).json({
      message: 'Invalid token',
    })
  }

  if (error instanceof TimeoutError) {
    return res.status(408).json({
      message: 'Database timeout',
    })
  }

  if (error instanceof ConnectionError) {
    return res.status(503).json({
      message: 'Database connection error',
    })
  }

  if (error instanceof DatabaseError) {
    return res.status(500).json({
      message: 'Database error',
    })
  }

  if (error?.statusCode) {
    return res.status(error.statusCode).json({
      message: error.message || 'Request failed',
      errors: error.errors || undefined,
    })
  }

  return res.status(500).json({
    message: error?.message || 'Internal server error',
  })
}