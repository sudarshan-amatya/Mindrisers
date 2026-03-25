import { DataTypes } from 'sequelize'
import sequelize from '../connections/database'
import { Buyer, Seller } from '../constants/role'

const User = sequelize.define(
    'User',
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM,
            values: [Buyer, Seller],
            defaultValue: Buyer,
        },
    },
    {
        tableName: 'users',
        underscored: true,
        timestamps: true,
    }
)

export default User