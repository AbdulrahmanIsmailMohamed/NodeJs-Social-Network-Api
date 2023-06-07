import { Router } from "express";

import UserController from "../controllers/user.controller";
import { allowTo, protectRoute } from "../config/auth";
import postsRoute from "./posts.routes";
import { uploadSingleImage } from '../middlewares/multer';
import {
    getUserPostsValidator,
    getUserValidator,
    updateUserValidator
} from "../utils/validator/user.validator";

const router: Router = Router();
const userContrller = new UserController()

router.use("/:userId/posts", getUserPostsValidator, postsRoute);

router.use(protectRoute)

router.get("/getMe", userContrller.getUser)

router
    .route("/")
    .get(allowTo, userContrller.getUsers) //* this endpoint allow to admin only
    .patch(updateUserValidator, uploadSingleImage("profileImage"), userContrller.updateLoggedUser)
    .delete(userContrller.inactiveLoggedUser)

router.get("/:id", getUserValidator, userContrller.getUser)

export default router;