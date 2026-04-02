import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthedRequest extends Request {
  user?: JwtPayload & { id: number; email?: string; firstName?: string; role?: string };
}

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = auth.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "JWT secret missing" });
  }

  try {
    const decoded = jwt.verify(token, secret);

    // ✅ guard: jwt.verify may return string
    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // ✅ now decoded is JwtPayload
    req.user = decoded as JwtPayload & { id: number; email?: string; firstName?: string; role?: string };

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
