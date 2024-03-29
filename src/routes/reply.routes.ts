import { Router } from "express";

import { ReplyController } from '../controllers/reply.controller';
import { protectRoute } from '../config/auth';
import { uploadSingleImage } from "../middlewares/multer";

import {
    createReplyValidator,
    deleteReplyValidator,
    getReplysValidator
} from '../utils/validator/reply.validator';

const router: Router = Router();
const replyController = new ReplyController();

router.use(protectRoute)

router
    .route("/:commentId")
    .post(uploadSingleImage("image"), createReplyValidator, replyController.createReply)
    .get(getReplysValidator, replyController.getReplys);

router.delete("/:commentId/:replyId", deleteReplyValidator, replyController.deleteReply);

export default router;