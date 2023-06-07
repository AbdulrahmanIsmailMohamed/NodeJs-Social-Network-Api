import { Router } from "express";

import { PostController } from '../controllers/posts.controller';
import { protectRoute } from "../config/auth";
import {
    createPostValidator,
    deletePostValidator,
    updatePostValidator
} from "../utils/validator/posts.validator";
import { uploadMultiImages } from "../middlewares/multer";

const router: Router = Router({ mergeParams: true });
const postController = new PostController()

router.use(protectRoute)

router.get("/me", postController.getLoggedUserPosts)

router
    .route("/")
    .post(createPostValidator, uploadMultiImages("images"), postController.createPost)
    .get(postController.getFrinedsPosts)

router.get("/friend", postController.getUserPosts)

router
    .route("/:id")
    .patch(updatePostValidator, postController.updatePost)
    .delete(deletePostValidator, postController.deletePost)

export default router;