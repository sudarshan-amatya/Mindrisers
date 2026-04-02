import { NextFunction, Request, Response } from "express";
import authService from "../services/authService";

const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.signup(req);
      return res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (err) {
      return next(err);
    }
  },

  login: async(req: Request, res: Response,next:NextFunction) => {
     try {
      let user = await authService.login(req);
      if (user) {
        res.send(user);
      } else {
        res.status(401).send({
          msg: "invalid createndatinsl",
        });
      }
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
