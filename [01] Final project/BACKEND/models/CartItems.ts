import { DataTypes } from 'sequelize'
import sequelize from '../connections/database'

const CartItem = sequelize.define(
    'CartItem',
    {
        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1,
            },
        },
    },
    {
        tableName: 'cart_items',
        underscored: true,
        timestamps: true,
    }
)

export default CartItem