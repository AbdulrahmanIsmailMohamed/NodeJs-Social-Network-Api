import { UploadApiResponse } from "cloudinary";

import { Comment } from "../models/Comments"
import { errorHandling } from "../utils/errorHandling"
import APIError from '../utils/apiError';
import { CreateReply, DeleteReply, ReplySanitize } from '../interfaces/reply.interface';
import cloudinary from '../config/coludinaryConfig';

export class ReplyService {
    createReply = async (replyData: CreateReply, imagePath: string | undefined): Promise<ReplySanitize> => {
        const { commentId, replyBody } = replyData;

        if (imagePath) {
            const result = await (await errorHandling(
                cloudinary.uploader.upload(
                    imagePath,
                    {
                        folder: "uploads/comments/replys",
                        format: "jpg",
                        public_id: `${Date.now()}-reply`
                    }
                )
            ) as Promise<UploadApiResponse>);

            if (!result) throw new APIError("Internal Server Error", 500);
            replyBody.image = result.url;
        }

        const reply = await errorHandling(
            Comment.findByIdAndUpdate(
                commentId,
                { $addToSet: { reply: replyBody } },
                { new: true }
            ).select("reply").populate("userId", "name profileImage")
        ) as ReplySanitize;
        if (!reply) throw new APIError("Can't create reply", 400);
        return reply
    }

    getReplys = async (commentId: string): Promise<ReplySanitize> => {
        const replys = await errorHandling(
            Comment.findById(commentId)
                .select("reply")
                .populate("userId", "name profileImage").exec()
        ) as ReplySanitize;
        if (!replys) throw new APIError("Can't find replys", 404);
        return replys
    }

    deleteReply = async (replyData: DeleteReply): Promise<ReplySanitize> => {
        const { commentId, replyId, userId } = replyData;

        const reply = await errorHandling(
            Comment.findOneAndUpdate(
                {
                    _id: commentId,
                    reply: { $elemMatch: { userId } }
                },
                {
                    $pull: { reply: { _id: replyId } }
                },
                { new: true }
            ).select("reply").populate("userId", "name profileImage")
        ) as ReplySanitize;
        if (!reply) throw new APIError("Not Found reply for this comment", 404);
        return reply
    }
}