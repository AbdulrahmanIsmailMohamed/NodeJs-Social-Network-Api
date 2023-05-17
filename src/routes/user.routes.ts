import { Router } from "express";

import UserController from "../controllers/user.controller";
import { protectRoute } from "../config/auth";
import postsRoute from "./posts.routes";

const router: Router = Router();
const userContrller = new UserController()

router.use("/:userId/posts", postsRoute);
router.use(protectRoute)


router.get("/getMe", userContrller.getUser)

router
    .route("/")
    .get(userContrller.getUsers)
    .patch(userContrller.updateUser)

router
    .route("/:id")
    .get(userContrller.getUser)
    .delete(userContrller.inactiveUser)

export default router;