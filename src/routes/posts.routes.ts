import { Router } from "express";
import { PostController } from '../controllers/posts.controller';
import { protectRoute } from "../config/auth";

const router: Router = Router();
const postController = new PostController()

router.use(protectRoute)

router
    .route("/")
    .post(postController.createPost)
    .get(postController.getPosts)

router
    .route("/:id")
    .patch(postController.updatePost)
    .delete(postController.deletePost)

export default router;