import { NextFunction, Response } from "express";
import AuthenticatedRequest from "../interfaces/authenticatedRequest.interface";
import { asyncHandler } from "./asyncHandlerMW";

export const getLoggedUserId = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        req.params.id = req.user._id;
        next();
    }
);