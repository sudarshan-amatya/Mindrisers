import { DataTypes, DATE } from 'sequelize';
import sequelize from '../connections/database';
import { worker } from 'node:cluster';
import { Buyer, Seller } from '../constants/role';

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
    // Other model options go here
  },
);
export default User;
