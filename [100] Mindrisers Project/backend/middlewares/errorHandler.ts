import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import {
  ConnectionError,
  DatabaseError,
  TimeoutError,
  UniqueConstraintError,
  ValidationError,
} from "sequelize";

function errorHandler(
  // err: any,
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    let errors = err.errors.map((el) => {
      return {
        field: el.path,
        mesage: el.message,
      };
    });
    return res.status(400).send({
      msg: err.message,
      errors,
      //   errors:err.errors
    });
  }

  if (err instanceof DatabaseError) {
    return res.status(500).send({
      msg: err.message,
    });
  }

  if (err instanceof ConnectionError || err instanceof TimeoutError) {
    return res.status(503).send({
      msg: err.message,
    });
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(401).send({
      msg: "Invalid Credentails",
    });
  }

  console.log(err);
  res.status(500).send({
    msg: "SERVER error",
  });
}

export default errorHandler;
