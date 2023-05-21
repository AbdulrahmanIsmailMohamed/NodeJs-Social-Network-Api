import { Router } from "express";

import { protectRoute } from "../config/auth";
import { CommentController } from "../controllers/comments.controller";
import {
    createCommentValidator,
    deleteCommentValidator,
    getCommentValidator,
    updateCommentValidator
} from '../utils/validator/comments.validator';

const router: Router = Router();
const commentController = new CommentController();

router.use(protectRoute);

router
    .route("/:postId")
    .post(createCommentValidator, commentController.createComment)
    // .get(commentController.getComments)

router
    .route("/:id")
    .get(getCommentValidator, commentController.getComment)
    .patch(updateCommentValidator, commentController.updateComment)
    .delete(deleteCommentValidator, commentController.deleteComment)

export default router;