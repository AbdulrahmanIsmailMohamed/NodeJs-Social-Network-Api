import { Comment } from "../models/Comments";
import { errorHandling } from "../utils/errorHandling";
import APIError from "../utils/apiError";
import {
  CreateReply,
  DeleteReply,
} from "../interfaces/reply.interface";
import cloudinary from "../config/coludinaryConfig";
import { IComment } from "interfaces/comments.interface";

export class ReplyService {
  createReply = async (
    replyData: CreateReply,
    imagePath: string | undefined
  ): Promise<IComment> => {
    const { commentId, replyBody } = replyData;

    if (imagePath) {
      const result = await errorHandling(
        cloudinary.uploader.upload(imagePath, {
          folder: "uploads/comments/replys",
          format: "jpg",
          public_id: `${Date.now()}-reply`,
        })
      );

      if (!result) throw new APIError("Internal Server Error", 500);
      replyBody.image = result.url;
    }

    const reply = await errorHandling(
      Comment.findByIdAndUpdate(
        commentId,
        { $addToSet: { reply: replyBody } },
        { new: true }
      )
        .select("reply")
        .populate("userId", "name profileImage")
        .exec()
    );
    if (!reply) throw new APIError("Can't create reply", 400);
    return reply;
  };

  getReplys = async (commentId: string): Promise<IComment> => {
    const replys = await errorHandling(
      Comment.findById(commentId)
        .select("reply")
        .populate("userId", "name profileImage")
        .exec()
    );
    if (!replys) throw new APIError("Can't find replys", 404);
    return replys;
  };

  deleteReply = async (replyData: DeleteReply): Promise<IComment> => {
    const { commentId, replyId, userId } = replyData;

    const reply = await errorHandling(
      Comment.findOneAndUpdate(
        {
          _id: commentId,
          reply: { $elemMatch: { userId } },
        },
        {
          $pull: { reply: { _id: replyId } },
        },
        { new: true }
      )
        .select("reply")
        .populate("userId", "name profileImage")
        .exec()
    );
    if (!reply) throw new APIError("Not Found reply for this comment", 404);
    return reply;
  };
}
