import { Router } from "express";

import { protectRoute } from "../config/auth";
import { CommentController } from "../controllers/comments.controller";

const router: Router = Router();
const commentController = new CommentController();

router.use(protectRoute);

router
    .route("/:postId")
    .post(commentController.createComment)
    .get(commentController.getComments)

router
    .route("/:id")
    .get(commentController.getComment)
    .patch(commentController.updateComment)
    .delete(commentController.deleteComment)

export default router;