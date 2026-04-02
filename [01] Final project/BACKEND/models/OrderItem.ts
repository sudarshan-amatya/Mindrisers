import { DataTypes } from 'sequelize'
import sequelize from '../connections/database'

const OrderItem = sequelize.define(
    'OrderItem',
    {
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sellerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
    },
    {
        tableName: 'order_items',
        underscored: true,
        timestamps: true,
    }
)

export default OrderItem