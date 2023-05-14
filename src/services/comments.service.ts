import APIError from "../utils/apiError";
import { Comment } from "../models/Comments"
import { errorHandling } from "../utils/errorHandling"

export class CommentService {
    createComment = async (commentBody: any): Promise<any> => {
        const comment = await errorHandling(Comment.create(commentBody));
        if (!comment) throw new APIError("Can't create comment", 400);
        return comment;
    }

    updateComment = async (data: any) => {
        const comment = await errorHandling(
            Comment.findOneAndUpdate(
                { _id: data.commentId, userId: data.userId },
                data.commentBody,
                { new: true }
            )
        );
        if (!comment) throw new APIError("Can't update comment", 400);
        return comment
    }

    deleteComment = async (data: any) => {
        const comment = await errorHandling(
            Comment.findOneAndDelete({ _id: data.commentId, userId: data.userId })
        );
        if (!comment) throw new APIError("Can't delete comment", 400);
        return "Done";
    }
}