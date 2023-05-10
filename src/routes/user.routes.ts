import express, { Router } from "express";

import UserController from "../controllers/user.controller";

const router: Router = express.Router();
const userContrller = new UserController()

router
    .route("/")
    .post(userContrller.createUser)

export default router