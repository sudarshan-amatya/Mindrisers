import { DataTypes } from 'sequelize'
import sequelize from '../connections/database'

const Cart = sequelize.define(
    'Cart',
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: 'carts',
        underscored: true,
        timestamps: true,
    }
)

export default Cart