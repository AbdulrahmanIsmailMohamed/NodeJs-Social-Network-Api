import { NextFunction, Request, Response } from "express";

import { ReplyService } from "../services/reply.service";
import { asyncHandler } from "../middlewares/asyncHandlerMW";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";
import APIError from "../utils/apiError";
import { CreateReply, DeleteReply } from "../interfaces/reply.interface";

export class ReplyController {
  constructor(private replyService: ReplyService) {}

  createReply = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const replyData: CreateReply = {
          commentId: req.params.commentId,
          replyBody: {
            userId: req.user._id as string,
            comment: req.body.comment,
          },
        };
        const imagePath: string | undefined = req.file?.path;

        const reply = await this.replyService.createReply(replyData, imagePath);
        if (!reply) return next(new APIError("Can't create reply", 400));
        res.status(201).json({ status: "Success", reply });
      } else return next(new APIError("Please login", 401));
    }
  );

  getReplys = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const replys = await this.replyService.getReplys(req.params.commentId);
      if (!replys) return next(new APIError("Can't Find Replys", 404));
      res.status(200).json({ status: "Success", replys });
    }
  );

  deleteReply = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const replyData: DeleteReply = {
        commentId: req.params.commentId,
        replyId: req.params.replyId,
        userId: req.user?._id as string,
      };
      const replys = await this.replyService.deleteReply(replyData);
      if (!replys) return next(new APIError("Can't delete Reply", 400));
      res.status(200).json({ status: "Success", replys });
    }
  );
}
