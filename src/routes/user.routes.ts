import express, { Router } from "express";

import UserController from "../controllers/user.controller";

const router: Router = express.Router();
const userContrller = new UserController()

router
    .route("/")
    .get(userContrller.getUsers)

router
    .route("/:id")
    .delete(userContrller.inactiveUser)
    .patch(userContrller.updateUser)

export default router