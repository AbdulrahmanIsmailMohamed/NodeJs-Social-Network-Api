import { Router } from "express";

import { LikesController } from '../controllers/likes.controller';
import { protectRoute } from "../config/auth";

const router: Router = Router();
const likesController = new LikesController()

router.use(protectRoute);

router
    .route("/:postId")
    .post(likesController.addOrDeleteLike)

export default router;