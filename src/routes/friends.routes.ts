import { protectRoute } from "../config/auth";
import FriendsController from "../controllers/friends.controller";
import express, { Router } from "express";

const router: Router = express.Router();
const friendController = new FriendsController()

router.patch("/:id",protectRoute, friendController.friendRequest)

export default router;