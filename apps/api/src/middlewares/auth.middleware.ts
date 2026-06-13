import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "../types/auth.types";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "No token provided",
      });
      return;
    }

    const token =
      authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;

    const user: AuthUser ={
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      role: decoded.role,
    };

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};