import { asyncHandler } from "../middlewares/asyncHandlerMW";
import AuthService from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import APIError from "../utils/apiError";

class AuthController {
    authService: AuthService;
    constructor() {
        this.authService = new AuthService()
    }
    register = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = await this.authService.register(req.body);
        if (!user) return next(new APIError("The User Can't Be Created!", 400));
        res.status(201).json({ status: "Success", user });
    });
    login = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userData = {
            email: req.body.email,
            password: req.body.password
        }
        const user = await this.authService.login(userData);
        if (!user) return next(new APIError("The User Can't Be Created!", 400));
        res.status(201).json({ status: "Success", user });
    });
}

export default AuthController;