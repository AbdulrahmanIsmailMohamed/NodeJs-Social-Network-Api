import { NextFunction, Request, Response } from "express";

import { asyncHandler } from "../middlewares/asyncHandlerMW";
import AuthService from "../services/auth.service";
import APIError from "../utils/apiError";
import { createToken } from "../utils/createToken";
import {
    LoginBody,
    LoginSanitize,
    RegisterBody,
    RegisterSanitize
} from "../interfaces/authentication.interface";

class AuthController {
    private authService: AuthService;
    constructor() {
        this.authService = new AuthService()
    }

    register = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const registerBody: RegisterBody = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            number: req.body.number
        };

        const result: RegisterSanitize = await this.authService.register(registerBody);
        if (!result) return next(new APIError("The User Can't Be Registerd!", 400));
        const token = createToken(result._id);

        res.status(201).json({
            status: "Success",
            user: result,
            token
        });
    });

    login = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const loginBody: LoginBody = {
            email: req.body.email,
            password: req.body.password
        }

        const result: LoginSanitize = await this.authService.login(loginBody);
        if (!result) return next(new APIError("The User Can't Be Created!", 401));
        const token = createToken(result._id)

        res.status(200).json({
            status: "Success",
            user: result,
            token
        });
    });
}

export default AuthController;