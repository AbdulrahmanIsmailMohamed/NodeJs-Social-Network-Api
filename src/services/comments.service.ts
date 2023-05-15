import APIError from "../utils/apiError";
import { Comment } from "../models/Comments"
import { errorHandling } from "../utils/errorHandling"

export class CommentService {
    createComment = async (commentBody: any): Promise<any> => {
        const comment = await errorHandling(Comment.create(commentBody));
        if (!comment) throw new APIError("Can't create comment", 400);
        return comment;
    }

    updateComment = async (data: any): Promise<any> => {
        const comment = await errorHandling(
            Comment.findOneAndUpdate(
                {
                    _id: data.commentId,
                    userId: data.userId,
                    postId: data.postId
                },
                data.commentBody,
                { new: true }
            )
        );
        if (!comment) throw new APIError("Can't update comment", 400);
        return comment
    }

    deleteComment = async (data: any): Promise<string> => {
        const comment = await errorHandling(
            Comment.findOneAndDelete({ _id: data.commentId, userId: data.userId })
        );
        if (!comment) throw new APIError("Can't delete comment", 400);
        return "Done";
    }

    getComments = async (postId: any): Promise<any> => {
        const comments = await errorHandling(Comment.find({ postId }));
        if (!comments) throw new APIError("can't find comments", 404);
        return comments
    }

    getComment = async (data: any): Promise<any> => {
        const comment = await errorHandling(
            Comment.findOne({ _id: data.commentId, postId: data.postId })
        );
        if (!comment) throw new APIError("can't find comment", 404);
        return comment
    }
}