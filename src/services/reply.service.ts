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
            )
        );
        if (!reply) throw new APIError("Can't create reply", 400);
        return reply
    }

    getReplys = async (commentId: any): Promise<any> => {
        const replys = await errorHandling(Comment.findById(commentId).select("reply"));
        if (!replys) throw new APIError("Can't find replys", 404);
        return replys
    }

    deleteReplys = async (data: any): Promise<any> => {
        const reply = await errorHandling(
            Comment.findByIdAndUpdate(
                data.commentId,
                {
                    $pull: { reply: { _id: data.replyId } }
                },
                { new: true }
            )
        );
        if (!reply) throw new APIError("Can't delete reply", 400);
        return reply
    }
}