import { Router } from "express";

import { protectRoute } from "../config/auth";
import FriendsController from "../controllers/friends.controller";
import {
    acceptFriendRequestValidator,
    cancelFriendRequestValidator,
    deleteFriendValidator,
    getUserFriendsValidator,
    sendFriendRequestValidator
} from '../utils/validator/friends.validator';

const router: Router = Router();
const friendController = new FriendsController()

router
    .use(protectRoute)

    .get("/", friendController.getFriends)

    .get("/friendsRequest", friendController.getFriendsRequest)

    .get("/myFriendsRequest", friendController.getMyFriendsRequest)

    .get("/:id", getUserFriendsValidator,friendController.getFriends)

    .patch("/:id", sendFriendRequestValidator, friendController.sendFriendRequest)

    .patch("/accept/:id", acceptFriendRequestValidator, friendController.acceptFriendRequest)

    .delete("/cancel/:id", cancelFriendRequestValidator, friendController.cancelFriendRequest)
    
    .delete("/deleteFriend/:id", deleteFriendValidator, friendController.deleteFriendFromFriends)

export default router;