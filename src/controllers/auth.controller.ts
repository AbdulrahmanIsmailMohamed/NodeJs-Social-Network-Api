import { NextFunction, Request, Response } from "express";

import { asyncHandler } from "../middlewares/asyncHandlerMW";
import AuthService from "../services/auth.service";
import APIError from "../utils/apiError";
import { createToken } from "../utils/createToken";

class AuthController {
    authService: AuthService;
    constructor() {
        this.authService = new AuthService()
    }
    register = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = await this.authService.register(req.body);
        if (!user) return next(new APIError("The User Can't Be Registerd!", 400));
        const token = createToken(user)
        res.status(201).json({ status: "Success", user , token});
    });

    login = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userData = {
            email: req.body.email,
            password: req.body.password
        }
        const user = await this.authService.login(userData);
        if (!user) return next(new APIError("The User Can't Be Created!", 400));
        const token = createToken(user)
        res.status(201).json({ status: "Success", user, token });
    });
}

export default AuthController;