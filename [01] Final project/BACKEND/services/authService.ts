import { Request } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

const authService = {
  signup: async (req: Request) => {
    let hashed = await bcrypt.hash(req.body.password, 10);
    return await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashed,
    });
  },
  login: async (req: Request) => {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return false;
    }
    const userData = user.toJSON();
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      userData.password,
    );
    if (!isPasswordValid) {
      return false;
    }
    const secret = process.env.JWT_SECRETKEY;
    if (!secret) {
      throw new Error('JWT secret is not configured');
    }
    const payload = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    };
    const token = jsonwebtoken.sign(payload, secret, {
      expiresIn: '1d',
    });
    return {
      ...payload,
      token,
    };
  },
};
export default authService;
