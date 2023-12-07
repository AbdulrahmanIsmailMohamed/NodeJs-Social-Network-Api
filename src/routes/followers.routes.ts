import { Router } from "express";

import { protectRoute } from "../config/auth";
import { FollowersControllor } from "../controllers/followers.controller";
import {
  followUserValidator,
  getFollowersValidator,
  unFollowUserValidator,
} from "../utils/validator/followers.validator";

const router: Router = Router();
const followersControlloer: FollowersControllor = new FollowersControllor();

router.use(protectRoute);

router.get("/", followersControlloer.getFollowers);

router
  .route("/:id")
  .post(followUserValidator, followersControlloer.followeUser)
  .get(getFollowersValidator, followersControlloer.getFollowers)
  .delete(unFollowUserValidator, followersControlloer.unFolloweUser);

export default router;
