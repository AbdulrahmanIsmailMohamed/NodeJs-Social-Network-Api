import { NextFunction, Request, Response } from "express";
import APIError from "../utils/apiError";

class ErrorHandlingMiddleware {
    public static forDevelopment(err: APIError, res: Response): void {
        res.status(err.statusCode).json({
            status: err.statusCode,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    public static forProduction(err: APIError, res: Response): void {
        res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
        });
    }
    public static handle(
        err: APIError,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || "Error";
        if (process.env.NODE_ENV === "development") {
            ErrorHandlingMiddleware.forDevelopment(err, res);
        } else {
            ErrorHandlingMiddleware.forProduction(err, res);
            if (err.name === "JsonWebTokenError") {
                throw new APIError("Invalid Token, Please Login..", 401);
            }
            if (err.name === "TokenExpiredError") {
                throw new APIError("Expired Token, Please Login again..", 401);
            }
        }
    }
}

export default ErrorHandlingMiddleware;