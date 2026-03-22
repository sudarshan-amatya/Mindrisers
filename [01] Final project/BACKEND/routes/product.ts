import { NextFunction, Request, Response, Router } from 'express';
import checkAuthentication from '../middlewares/auth';
const router = Router();

router.post('/', checkAuthentication, (req: Request, res: Response) => {
  res.send('Products Routes...');
});

export default router;
