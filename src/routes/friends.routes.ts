import { protectRoute } from "../config/auth";
import FriendsController from "../controllers/friends.controller";
import { Router } from "express";

const router: Router = Router();
const friendController = new FriendsController()

router.use(protectRoute)

router
    .route("/")
    .get(friendController.getFriends)

router
    .route("/:id")
    .patch(friendController.friendRequest)

router
    .patch("/accept/:id", friendController.acceptFriendRequest)
    .delete("/cancel/:id", friendController.cancelFriendRequest)

export default router;