import { Router } from "express";

import { ReplyController } from '../controllers/reply.controller';
import { protectRoute } from '../config/auth';

const router: Router = Router();
const replyController = new ReplyController();

router.use(protectRoute)

router
    .route("/:commentId")
    .post(replyController.createReply)
    .post(replyController.getReplys);

router.delete("/:id", replyController.deleteReply);

export default router;