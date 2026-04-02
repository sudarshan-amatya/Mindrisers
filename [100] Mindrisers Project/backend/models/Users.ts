import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "../connections/databases";
import { ADMIN, CUSTOMER, SELLER } from "../constants/role";

const User = sequelize.define(
  "User",
  {
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING(50),
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
      type: DataTypes.ENUM(CUSTOMER, ADMIN, SELLER),
      allowNull: false,
      defaultValue: CUSTOMER,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    underscored: true,
    timestamps: true,

    // // ✅ hide password by default
    // defaultScope: {
    //   attributes: { exclude: ["password"] },
    // },

    // // ✅ optional: allow fetching password when needed (login)
    // scopes: {
    //   withPassword: {
    //     attributes: { include: ["password"] },
    //   },
    // },
  }
);

//Password hooks
User.beforeCreate(async (user: any) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user: any) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

export default User;
