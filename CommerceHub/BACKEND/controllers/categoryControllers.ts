import { NextFunction, Request, Response } from 'express'
import categoryService from '../services/categoryService'

type CategoryParams = {
    id: string
}

const categoryController = {
    createCategory: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await categoryService.createCategory(req.body)

            return res.status(201).json({
                message: 'Category created successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    getAllCategories: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = await categoryService.getAllCategories()

            return res.status(200).json({
                message: 'Categories fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    getAllAdminCategories: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = await categoryService.getAllAdminCategories()

            return res.status(200).json({
                message: 'Admin categories fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    getCategoryById: async (
        req: Request<CategoryParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = await categoryService.getCategoryById(req.params.id)

            return res.status(200).json({
                message: 'Category fetched successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    updateCategory: async (
        req: Request<CategoryParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = await categoryService.updateCategory(
                req.params.id,
                req.body
            )

            return res.status(200).json({
                message: 'Category updated successfully',
                data,
            })
        } catch (error) {
            return next(error)
        }
    },

    deleteCategory: async (
        req: Request<CategoryParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await categoryService.deleteCategory(req.params.id)

            return res.status(200).json({
                message: 'Category deleted successfully',
            })
        } catch (error) {
            return next(error)
        }
    },
}

export default categoryController