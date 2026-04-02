import { DataTypes } from 'sequelize'
import sequelize from '../connections/database'

const Wishlist = sequelize.define(
    'Wishlist',
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'wishlists',
        underscored: true,
        timestamps: true,
    }
)

export default Wishlist