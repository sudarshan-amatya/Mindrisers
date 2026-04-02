import { DataTypes } from 'sequelize'
import sequelize from '../connections/database'

const Category = sequelize.define(
    'Category',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.ENUM,
            values: ['active', 'inactive'],
            defaultValue: 'active',
        },
    },
    {
        tableName: 'categories',
        underscored: true,
        timestamps: true,
    }
)

export default Category