import { NextFunction, Request, Response } from 'express';
import cartService from '../services/cartService';

type CartItemParams = {
  id: string;
};

const cartController = {
  getMyCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.isAdmin) {
        return res.status(403).json({
          message: 'Admin cannot access cart',
        });
      }
      if (!req.user?.id) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      const data = await cartService.getMyCart(req.user.id);

      return res.status(200).json({
        message: 'Cart fetched successfully',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  addToCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      const data = await cartService.addToCart(req.user.id, req.body);

      return res.status(200).json({
        message: 'Product added to cart successfully',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  updateCartItem: async (
    req: Request<CartItemParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      const data = await cartService.updateCartItem(
        req.user.id,
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        message: 'Cart item updated successfully',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  removeCartItem: async (
    req: Request<CartItemParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      const data = await cartService.removeCartItem(req.user.id, req.params.id);

      return res.status(200).json({
        message: 'Cart item removed successfully',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  clearCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      await cartService.clearCart(req.user.id);

      return res.status(200).json({
        message: 'Cart cleared successfully',
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default cartController;
