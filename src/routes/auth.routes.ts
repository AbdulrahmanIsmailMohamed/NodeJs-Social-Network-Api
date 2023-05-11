import express, { Router } from "express";

import AuthController from "../controllers/auth.controller";
import { loginValidator, registerValidor } from "../utils/validator/auth.validator";

const router: Router = express.Router();
const authController = new AuthController();

router
    .post("/register", registerValidor, authController.register)
    .post("/login", loginValidator, authController.login)

export default router;