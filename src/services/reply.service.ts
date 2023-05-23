import { Comment } from "../models/Comments"
import { errorHandling } from "../utils/errorHandling"
import APIError from '../utils/apiError';

export class ReplyService {
    createReply = async (data: any): Promise<any> => {
        const { commentId, replyBody } = data;
        const reply = await errorHandling(
            Comment.findByIdAndUpdate(
                commentId,
                { $addToSet: { reply: replyBody } },
                { new: true }
            ).select("reply")
        );
        if (!reply) throw new APIError("Can't create reply", 400);
        return reply
    }

    getReplys = async (commentId: any): Promise<any> => {
        const replys = await errorHandling(Comment.findById(commentId).select("reply"));
        if (!replys) throw new APIError("Can't find replys", 404);
        return replys
    }

    deleteReply = async (data: any): Promise<any> => {
        const { commentId, replyId } = data;
        const reply = await errorHandling(
            Comment.findOneAndUpdate(
                { _id: commentId },
                {
                    $pull: { reply: { _id: replyId } }
                },
                { new: true }
            ).select("reply")
        );
        if (!reply) throw new APIError("Not Found reply for this comment", 404);
        return reply
    }
}