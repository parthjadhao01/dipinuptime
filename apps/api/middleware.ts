import { getToken } from "next-auth/jwt";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

const secret = process.env.NEXTAUTH_SECRET!;

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json("No token provided");
    }

    const parts = authHeader.split(" ");

    if (parts.length != 2 || parts[0] != "Bearer") {
      return res.status(401).json({
        message: "Invalid auth formate",
      });
    }

    const rawToken = parts[1];

    if (!rawToken || rawToken === "undefined") {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    let parsedToken;

    try {
      parsedToken = jwt.verify(rawToken, secret);
    } catch (err) {
      return res.status(400).json({
        message: "Malformed token error",
        error: err,
      });
    }

    if (!parsedToken) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.user = parsedToken;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
