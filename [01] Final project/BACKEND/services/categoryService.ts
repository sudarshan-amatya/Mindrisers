import Category from '../models/Category'
import { z } from 'zod'

const categorySchema = z.object({
    name: z.string().trim().min(2, 'Category name is required'),
    slug: z.string().trim().min(2, 'Category slug is required'),
    status: z.enum(['active', 'inactive']).optional().default('active'),
})

const updateCategorySchema = categorySchema.partial()

const categoryService = {
    createCategory: async (body: unknown) => {
        const result = categorySchema.safeParse(body)

        if (!result.success) {
            const error = new Error('Validation failed')
            ;(error as any).statusCode = 400
            ;(error as any).errors = z.flattenError(result.error).fieldErrors
            throw error
        }

        const { name, slug, status } = result.data

        const existingCategory = await Category.findOne({
            where: { slug },
        })

        if (existingCategory) {
            const error = new Error('Category slug already exists')
            ;(error as any).statusCode = 400
            throw error
        }

        return await Category.create({
            name,
            slug,
            status,
        })
    },

    getAllCategories: async () => {
        return await Category.findAll({
            where: { status: 'active' },
            order: [['name', 'ASC']],
        })
    },

    getAllAdminCategories: async () => {
        return await Category.findAll({
            order: [['createdAt', 'DESC']],
        })
    },

    getCategoryById: async (id: string) => {
        const category = await Category.findByPk(id)

        if (!category) {
            const error = new Error('Category not found')
            ;(error as any).statusCode = 404
            throw error
        }

        return category
    },

    updateCategory: async (id: string, body: unknown) => {
        const result = updateCategorySchema.safeParse(body)

        if (!result.success) {
            const error = new Error('Validation failed')
            ;(error as any).statusCode = 400
            ;(error as any).errors = z.flattenError(result.error).fieldErrors
            throw error
        }

        const category = await Category.findByPk(id)

        if (!category) {
            const error = new Error('Category not found')
            ;(error as any).statusCode = 404
            throw error
        }

        if (result.data.slug) {
            const existingSlug = await Category.findOne({
                where: { slug: result.data.slug },
            })

            if (
                existingSlug &&
                (existingSlug.toJSON() as any).id !== (category.toJSON() as any).id
            ) {
                const error = new Error('Category slug already exists')
                ;(error as any).statusCode = 400
                throw error
            }
        }

        await Category.update(result.data, {
            where: { id },
        })

        return await Category.findByPk(id)
    },

    deleteCategory: async (id: string) => {
        const category = await Category.findByPk(id)

        if (!category) {
            const error = new Error('Category not found')
            ;(error as any).statusCode = 404
            throw error
        }

        await Category.destroy({
            where: { id },
        })

        return true
    },
}

export default categoryService