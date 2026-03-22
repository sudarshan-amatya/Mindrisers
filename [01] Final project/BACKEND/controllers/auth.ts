import { NextFunction, Request, Response } from 'express';
import authService from '../services/authService';

const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.signup(req);
      const userData = user.toJSON();
      delete userData.password;

      return res.status(201).json(userData);
    } catch (error) {
      return next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.login(req);

      if (!user) {
        return res.status(401).json({
          message: 'Invalid credentials.',
        });
      }

      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  },
};

export default authController;
