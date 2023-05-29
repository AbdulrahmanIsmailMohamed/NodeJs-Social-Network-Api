import { Router } from "express";

import users from "./user.routes";
import auth from "./auth.routes";
import friends from "./friends.routes";
import posts from "./posts.routes";
import comments from "./comments.routes";
import replys from "./reply.routes";

const router = Router()

router.use(`/users`, users);
router.use(`/auth`, auth);
router.use(`/friends`, friends);
router.use(`/posts`, posts);
router.use(`/comments`, comments);
router.use(`/replys`, replys);

export default router;