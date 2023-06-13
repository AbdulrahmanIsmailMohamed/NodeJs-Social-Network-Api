import { Router } from "express";

import { protectRoute } from "../config/auth";
import { FollowersControllor } from '../controllers/followers.controller';

const router: Router = Router();
const followersControlloer: FollowersControllor = new FollowersControllor();

router.use(protectRoute);

router.get("/", followersControlloer.getFollowers);

router
    .route("/:id")
    .get(followersControlloer.getFollowers)
    .post(followersControlloer.followeUser)
    .delete(followersControlloer.unFolloweUser);

export default router;