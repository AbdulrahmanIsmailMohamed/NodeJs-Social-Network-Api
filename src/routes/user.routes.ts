import { Router } from "express";

import UserController from "../controllers/user.controller";
import { allowTo, protectRoute } from "../config/auth";
import postsRoute from "./posts.routes";

const router: Router = Router();
const userContrller = new UserController()

router.use("/:userId/posts", postsRoute);

router.use(protectRoute)

router.get("/getMe", userContrller.getUser)

router
    .route("/")
    .get(allowTo, userContrller.getUsers) //this endpoint allow to admin only
    .patch(userContrller.updateLoggedUser)
    .delete(userContrller.inactiveLoggedUser)

router
    .route("/:id")
    .get(userContrller.getUser)

export default router;