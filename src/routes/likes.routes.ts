import { Router } from "express";

import { LikesController } from '../controllers/likes.controller';
import { protectRoute } from "../config/auth";
import { likesValidator } from "../utils/validator/likes.validator";

const router: Router = Router();
const likesController = new LikesController()

router.use(protectRoute);

router
    .route("/:postId")
    .post(likesValidator, likesController.addOrDeleteLike)
    .get(likesValidator, likesController.getFans)

export default router;