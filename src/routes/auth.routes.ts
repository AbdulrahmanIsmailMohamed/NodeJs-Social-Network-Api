import { Router } from "express";

import { apiLimiter } from '../middlewares/rateLimiterMW';
import AuthController from "../controllers/auth.controller";

import {
    loginValidator,
    registerValidor,
    forgotPasswordValidator,
    verifyResetCodeValidator,
    resetPasswordValidator
} from "../utils/validator/auth.validator";

const router: Router = Router();
const authController = new AuthController();

router
    .use(apiLimiter("To Many Request From This IP, Please Try Again After A Quarter Hour"))

    .post("/register", registerValidor, authController.register)

    .post("/login", loginValidator, authController.login)

    .post("/forgotPassword", forgotPasswordValidator, authController.forgotPassword)

    .post("/verifyResetCode", verifyResetCodeValidator, authController.verifyRestCode)

    .post("/resetPassword", resetPasswordValidator, authController.resetPassword);

export default router;