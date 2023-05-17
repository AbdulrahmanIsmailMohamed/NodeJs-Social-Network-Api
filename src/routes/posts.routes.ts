import { Router } from "express";

import { PostController } from '../controllers/posts.controller';
import { protectRoute } from "../config/auth";
import {
    createPostValidor,
    postIdValidator,
    updatePostValidor
} from "../utils/validator/posts.validator";

const router: Router = Router();
const postController = new PostController()

router.use(protectRoute)

router.get("/me", postController.getUserPosts)

router
    .route("/")
    .post(createPostValidor, postController.createPost)
    .get(postController.getFrinedsPosts)


router
    .route("/:id")
    .patch(updatePostValidor, postController.updatePost)
    .delete(postIdValidator, postController.deletePost)

export default router;