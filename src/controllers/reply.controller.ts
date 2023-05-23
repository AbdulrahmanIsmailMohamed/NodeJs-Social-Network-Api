import { NextFunction, Request, Response } from 'express';

import { ReplyService } from '../services/reply.service';
import { asyncHandler } from '../middlewares/asyncHandlerMW';
import AuthenticatedRequest from '../interfaces/authenticatedRequest.interface';
import APIError from '../utils/apiError';

export class ReplyController {
    private replyService: ReplyService;
    constructor() {
        this.replyService = new ReplyService();
    }

    createReply = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const data = {
            commentId: req.params.commentId,
            replyBody: {
                userId: req.user._id,
                ...req.body
            }
        }
        const reply = await this.replyService.createReply(data);
        if (!reply) return next(new APIError("Can't create reply", 400));
        res.status(201).json({ status: "Success", reply });
    });

    getReplys = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const replys = await this.replyService.getReplys(req.params.commentId);
        if (!replys) return next(new APIError("Can't Find Replys", 404));
        res.status(200).json({ status: "Success", replys })
    });

    deleteReply = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const data = {
            commentId: req.params.commentId,
            replyId: req.params.replyId
        }
        const replys = await this.replyService.deleteReply(data);
        if (!replys) return next(new APIError("Can't delete Reply", 400));
        res.status(200).json({ status: "Success", replys })
    });
}