import { NextFunction, Request, Response } from 'express';
import productService from '../services/productService';

type ProductParams = {
  id: string;
};

const productController = {
  getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await productService.getAllProducts();

      return res.status(200).json({
        message: 'Products fetched successfully',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  getProductById: async (
    req: Request<ProductParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await productService.getProductById(req.params.id);

      return res.status(200).json({
        message: 'Product fetched successfully',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      const files = req.files as
        | {
            [fieldname: string]: Express.Multer.File[];
          }
        | undefined;

      const thumbnailFile = files?.thumbnail?.[0];
      const imageFiles = files?.images || [];

      const thumbnail = thumbnailFile
        ? `/uploads/products/${thumbnailFile.filename}`
        : null;

      const images = imageFiles.map(
        (file) => `/uploads/products/${file.filename}`,
      );

      const data = await productService.createProduct(req.user.id, {
        ...req.body,
        thumbnail,
        images,
      });

      return res.status(201).json({
        message: 'Product created successfully',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  getSellerProducts: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      const data = await productService.getSellerProducts(req.user.id);

      return res.status(200).json({
        message: 'Products fetched successfully',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  getSellerProductById: async (
    req: Request<ProductParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      const data = await productService.getSellerProductById(
        req.user.id,
        req.params.id,
      );

      return res.status(200).json({
        message: 'Product fetched successfully',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  updateProduct: async (
    req: Request<ProductParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      const files = req.files as
        | {
            [fieldname: string]: Express.Multer.File[];
          }
        | undefined;

      const thumbnailFile = files?.thumbnail?.[0];
      const imageFiles = files?.images || [];

      const payload: Record<string, unknown> = { ...req.body };

      if (thumbnailFile) {
        payload.thumbnail = `/uploads/products/${thumbnailFile.filename}`;
      }

      if (imageFiles.length > 0) {
        payload.images = imageFiles.map(
          (file) => `/uploads/products/${file.filename}`,
        );
      }

      const data = await productService.updateProduct(
        req.user.id,
        req.params.id,
        payload,
      );

      return res.status(200).json({
        message: 'Product updated successfully',
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  deleteProduct: async (
    req: Request<ProductParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      await productService.deleteProduct(req.user.id, req.params.id);

      return res.status(200).json({
        message: 'Product deleted successfully',
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default productController;
