import { Router } from "express";

import AuthController from "../controllers/auth.controller";
import { loginValidator, registerValidor } from "../utils/validator/auth.validator";
import { apiLimiter } from '../middlewares/rateLimiterMW';

const router: Router = Router();
const authController = new AuthController();

router
    .post("/register", registerValidor, authController.register)
    .post("/login", loginValidator, authController.login)
    .post(
        "/forgotPassword",
        apiLimiter("To Many Request From This IP, Please Try Again After A Quarter Hour"),
        authController.forgotPaaword
    )
    .post("/verifyResetCode", authController.verifyRestCode)
    .post("/resetPassword", authController.resetPassword);

export default router;