import { Router } from "express";

import { PostController } from '../controllers/posts.controller';
import { protectRoute } from "../config/auth";
import {
    createPostValidator,
    deletePostValidator,
    hideUserPostsValidator,
    sharePostValidator,
    updatePostValidator
} from "../utils/validator/posts.validator";
import { uploadMedias } from "../middlewares/multer";

const router: Router = Router({ mergeParams: true });
const postController = new PostController()

router.use(protectRoute)

router.get("/me", postController.getLoggedUserPosts)
router.get("/memories", postController.postsCreatedOnTheSameDay)

router
    .route("/")
    .post(uploadMedias("media"), createPostValidator, postController.createPost)
    .get(postController.renderTimeline)

router.get("/friend", postController.getUserPosts)

router
    .route("/:id")
    .post(hideUserPostsValidator, postController.hideUserPosts)
    .patch(updatePostValidator, postController.updatePost)
    .delete(deletePostValidator, postController.deletePost);

router.post("/share/:sharePostId", sharePostValidator, postController.sharePost);

export default router;