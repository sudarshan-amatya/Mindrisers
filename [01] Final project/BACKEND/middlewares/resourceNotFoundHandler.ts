import { Request, Response } from 'express';

export default function resourceNotFoundHandler(req: Request, res: Response) {
  res.send({
    msg: 'resource not found...',
  });
}
