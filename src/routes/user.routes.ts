import { Router } from "express";

import UserController from "../controllers/user.controller";
import { protectRoute } from "../config/auth";

const router: Router = Router();
const userContrller = new UserController()

router.use(protectRoute)

router
    .route("/")
    .get(userContrller.getUsers)

router
    .route("/:id")
    .delete(userContrller.inactiveUser)
    .patch(userContrller.updateUser)

export default router