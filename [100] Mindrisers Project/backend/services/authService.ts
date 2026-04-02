import { Request } from "express";
import bcrypt from "bcrypt";
import User from "../models/Users";
import jwt from "jsonwebtoken";

export default {
  signup: async (req: Request) => {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    });

    const userData: any = user.toJSON();

    delete userData.password;
    delete userData.createdAt;
    delete userData.updatedAt;

    const secret = process.env.JWT_SECRET;
    if (!secret) return false;

    const token = jwt.sign(userData, secret, { expiresIn: "7d" });

    return {
      ...userData,
      token,
    };
  },

  login: async (req: Request) => {
    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) return false;

    const userData: any = user.toJSON();

    const passwordMatched = await bcrypt.compare(
      req.body.password,
      userData.password
    );

    if (!passwordMatched) return false;

    delete userData.password;
    delete userData.createdAt;
    delete userData.updatedAt;

    const secret = process.env.JWT_SECRET;
    if (!secret) return false;

    const token = jwt.sign(userData, secret, { expiresIn: "7d" });

    return {
      ...userData,
      token,
    };
  },
};
