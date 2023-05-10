import { NextFunction, Request, Response } from "express";

export const asyncHandler = (handler: (arg0: Request, arg1: Response) => any) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    };
