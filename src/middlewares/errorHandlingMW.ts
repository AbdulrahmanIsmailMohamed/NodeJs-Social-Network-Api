import { NextFunction, Request, Response } from "express";
import APIError from "../utils/apiError";

const errorForDevelopment = (err: APIError, res: Response) =>
    res.status(err.statusCode).json({
        status: err.statusCode,
        error: err,
        message: err.message,
        stack: err.stack
    });

const errorForProduction = (err: APIError, res: Response) =>
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message
    });

export const errorHandling = (err: APIError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";
    if (process.env.NODE_ENV === "development") {
        errorForDevelopment(err, res);
    } else {
        errorForProduction(err, res);
        if (err.name === "JsonWebTokenError") {
            new APIError("Invalid Token, Please Login..", 401);
        }
        if (err.name === "TokenExpiredError") {
            new APIError("Expire Token, Please Login again..", 401);
        }
    }
}