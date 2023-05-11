import { Request, Response, NextFunction } from "express";

export const asyncHandler = (routeHandler: (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await routeHandler(req, res, next);
        } catch (err) {
            next(err);
        }
    };