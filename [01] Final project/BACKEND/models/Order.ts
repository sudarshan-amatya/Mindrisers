import { DataTypes } from 'sequelize'
import sequelize from '../connections/database'

const Order = sequelize.define(
    'Order',
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        status: {
            type: DataTypes.ENUM,
            values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            defaultValue: 'pending',
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'cash_on_delivery',
        },
        paymentStatus: {
            type: DataTypes.ENUM,
            values: ['pending', 'paid', 'failed'],
            defaultValue: 'pending',
        },
        shippingAddress: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: 'orders',
        underscored: true,
        timestamps: true,
    }
)

export default Order