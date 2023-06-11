import { Router } from "express";

import users from "./user.routes";
import auth from "./auth.routes";
import friends from "./friends.routes";
import posts from "./posts.routes";
import comments from "./comments.routes";
import replys from "./reply.routes";
import favourites from "./favourite.routes";

const router = Router();

router
    .use(`/users`, users)
    .use(`/auth`, auth)
    .use(`/friends`, friends)
    .use(`/posts`, posts)
    .use(`/comments`, comments)
    .use(`/replys`, replys)
    .use(`/favourites`, favourites);

export default router;