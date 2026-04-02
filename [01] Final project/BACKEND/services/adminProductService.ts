import Product from '../models/Product'

const adminProductService = {
    getAllProducts: async () => {
        return await Product.findAll({
            order: [['createdAt', 'DESC']],
        })
    },

    deleteProduct: async (id: string) => {
        const product = await Product.findByPk(id)

        if (!product) {
            const error = new Error('Product not found')
            ;(error as any).statusCode = 404
            throw error
        }

        await Product.destroy({
            where: { id },
        })

        return true
    },
}

export default adminProductService