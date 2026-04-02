import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import userService from '../services/userService';

const userController = {
  requestSellerAccess: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (req.user?.isAdmin) {
        return res.status(403).json({
          message: 'Admin cannot request seller access',
        });
      }
      if (!req.user?.id) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      const userData = user.toJSON() as any;

      if (userData.isSeller) {
        return res.status(400).json({
          message: 'You are already a seller',
        });
      }

      if (userData.sellerRequestStatus === 'pending') {
        return res.status(400).json({
          message: 'Seller request is already pending',
        });
      }

      await User.update(
        {
          sellerRequestStatus: 'pending',
        },
        {
          where: {
            id: req.user.id,
          },
        },
      );

      return res.status(200).json({
        message: 'Seller request submitted successfully',
      });
    } catch (error) {
      return next(error);
    }
  },

  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      const data = await userService.getProfile(req.user.id);

      return res.status(200).json({
        message: 'Profile fetched successfully',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      const data = await userService.updateProfile(req.user.id, req.body);

      return res.status(200).json({
        message: 'Profile updated successfully',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default userController;
