import Product from '../models/Product';
import Category from '../models/Category';
import { z } from 'zod';

const createProductSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters'),
  slug: z.string().trim().min(2, 'Slug is required'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  discountPrice: z
    .union([z.coerce.number().min(0), z.literal(''), z.null()])
    .optional()
    .transform((val) => (val === '' ? null : (val ?? null))),
  stock: z.coerce.number().int().min(0, 'Stock must be 0 or more'),
  brand: z
    .union([z.string().trim(), z.literal('')])
    .optional()
    .transform((val) => (val === '' ? null : (val ?? null))),
  category: z.string().trim().min(2, 'Category is required'),
  thumbnail: z
    .union([z.string().trim(), z.null()])
    .optional()
    .transform((val) => val ?? null),
  images: z.array(z.string()).optional().default([]),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

const updateProductSchema = createProductSchema.partial();

const productService = {
  getAllProducts: async () => {
    return await Product.findAll({
      where: {
        status: 'active',
      },
      order: [['createdAt', 'DESC']],
    });
  },

  getProductById: async (id: string) => {
    const product = await Product.findOne({
      where: {
        id,
        status: 'active',
      },
    });

    if (!product) {
      const error = new Error('Product not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return product;
  },

  createProduct: async (sellerId: number | string, body: unknown) => {
    const result = createProductSchema.safeParse(body);
    

    if (!result.success) {
      const error = new Error('Validation failed');
      (error as any).statusCode = 400;
      (error as any).errors = z.flattenError(result.error).fieldErrors;
      throw error;
    }

    const existingProduct = await Product.findOne({
      where: { slug: result.data.slug },
    });

    if (existingProduct) {
      const error = new Error('Slug already exists');
      (error as any).statusCode = 400;
      throw error;
    }

    const categoryExists = await Category.findOne({
      where: {
        name: result.data.category,
        status: 'active',
      },
    });

    if (!categoryExists) {
      const error = new Error('Selected category does not exist');
      (error as any).statusCode = 400;
      throw error;
    }

    const product = await Product.create({
      ...result.data,
      sellerId,
    });

    return product;
  },

  getSellerProducts: async (sellerId: number | string) => {
    return await Product.findAll({
      where: { sellerId },
      order: [['createdAt', 'DESC']],
    });
  },

  getSellerProductById: async (sellerId: number | string, id: string) => {
    const product = await Product.findOne({
      where: {
        id,
        sellerId,
      },
    });

    if (!product) {
      const error = new Error('Product not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return product;
  },

  updateProduct: async (
    sellerId: number | string,
    id: string,
    body: unknown,
  ) => {
    const result = updateProductSchema.safeParse(body);

    if (!result.success) {
      const error = new Error('Validation failed');
      (error as any).statusCode = 400;
      (error as any).errors = z.flattenError(result.error).fieldErrors;
      throw error;
    }

    const product = await Product.findOne({
      where: {
        id,
        sellerId,
      },
    });

    if (!product) {
      const error = new Error('Product not found');
      (error as any).statusCode = 404;
      throw error;
    }

    if (result.data.slug) {
      const existingSlug = await Product.findOne({
        where: { slug: result.data.slug },
      });

      if (existingSlug && existingSlug.toJSON().id !== product.toJSON().id) {
        const error = new Error('Slug already exists');
        (error as any).statusCode = 400;
        throw error;
      }
    }

    if (result.data.category) {
      const categoryExists = await Category.findOne({
        where: {
          name: result.data.category,
          status: 'active',
        },
      });

      if (!categoryExists) {
        const error = new Error('Selected category does not exist');
        (error as any).statusCode = 400;
        throw error;
      }
    }

    await Product.update(result.data, {
      where: {
        id,
        sellerId,
      },
    });

    const updatedProduct = await Product.findOne({
      where: {
        id,
        sellerId,
      },
    });

    return updatedProduct;
  },

  deleteProduct: async (sellerId: number | string, id: string) => {
    const product = await Product.findOne({
      where: {
        id,
        sellerId,
      },
    });

    if (!product) {
      const error = new Error('Product not found');
      (error as any).statusCode = 404;
      throw error;
    }

    await Product.destroy({
      where: {
        id,
        sellerId,
      },
    });

    return true;
  },
};

export default productService;
