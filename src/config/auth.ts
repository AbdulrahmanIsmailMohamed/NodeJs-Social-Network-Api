import { asyncHandler } from "../middlewares/asyncHandlerMW";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import APIError from "../utils/apiError";
import User from "../models/User";
import DecodedToken from "../interfaces/decodedToken.interface";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";

export const protectRoute = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new APIError("Please login to access this route", 401));
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SEC as string
    ) as DecodedToken;
    if (!decoded) return next(new APIError("Invalid Token", 401));
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(
        new APIError("The user associated with this token does not exist", 401)
      );
    }
    if (!user.active) {
      return next(
        new APIError("Your account is inactive. Please log in again", 401)
      );
    }
    req.user = user;
    next();
  }
);

export const allowTo = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.isAdmin) return next();
    return next(new APIError("Can't access this route", 401));
  }
);
