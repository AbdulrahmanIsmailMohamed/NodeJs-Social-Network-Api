import { Router } from "express";

import { userIdValidator } from "../utils/validator/user.validator";
import { protectRoute } from "../config/auth";
import FriendsController from "../controllers/friends.controller";

const router: Router = Router();
const friendController = new FriendsController()

router
    .use(protectRoute)
    .get("/", friendController.getFriends)
    .get("/friendsRequest", friendController.getFriendsRequest)
    .patch("/:id", userIdValidator, friendController.friendRequest)
    .patch("/accept/:id", userIdValidator, friendController.acceptFriendRequest)
    .delete("/cancel/:id", userIdValidator, friendController.cancelFriendRequest)
    .delete("/deleteFriend/:id", userIdValidator, friendController.deleteFriendFromFriends)

export default router;