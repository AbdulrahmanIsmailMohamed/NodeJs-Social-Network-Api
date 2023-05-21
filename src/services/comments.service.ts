import APIError from "../utils/apiError";
import { Comment } from "../models/Comments"
import { errorHandling } from "../utils/errorHandling"
import SenitizeData from '../utils/senitizeData';
import { APIFeature } from "../utils/apiFeature";
import { features } from "process";

export class CommentService {
    private senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData();
    }

    createComment = async (commentBody: any): Promise<any> => {
        const comment = await errorHandling(
            (await Comment.create(commentBody)).populate("postId", "name imageProfile")
        );
        if (!comment) throw new APIError("Can't create comment", 400);
        return this.senitizeData.comments(comment);
    }

    updateComment = async (data: any): Promise<any> => {
        const { comment, image } = data.commentBody;
        const updateComment = await errorHandling(
            Comment.findOneAndUpdate(
                {
                    _id: data.commentId,
                    userId: data.userId,
                },
                { comment, image },
                { new: true }
            ).populate("userId", "name profileImage")
        );
        if (!updateComment) throw new APIError("Can't find this comment", 404);
        return updateComment
    }

    deleteComment = async (data: any): Promise<string> => {
        const { commentId, userId } = data
        const comment = await errorHandling(
            Comment.findOneAndDelete({ _id: commentId, userId }).lean()
        );

        /*
            if the user is not the owner comment,
            check if the user is the owner of the post containing the comment
        */
        if (!comment) {
            const isOwnerPost = await errorHandling(
                Comment.findOneAndDelete({ _id: commentId })
                    .select("postId")
                    .populate({
                        path: "postId",
                        match: { userId }
                    })
            )
            if (!isOwnerPost) throw new APIError("Can't delete comment", 400);
        }
        return "Done";
    }

    getPostComments = async (features: any): Promise<any> => {
        const { postId } = features;
        const countDocuments = await errorHandling(Comment.countDocuments({ postId }));
        if (!countDocuments) throw new APIError("can't find comments", 404);

        const apiFeatures = new APIFeature(Comment.find({ postId }), features).pagination(countDocuments);
        const comments = apiFeatures.exic("posts")
        if (!comments) throw new APIError("Can't find comments", 404)
        return comments
    }

    getComment = async (commentId: any): Promise<any> => {
        const comment = await errorHandling(
            Comment.findById(commentId).populate("userId", "name profileImage")
        );
        if (!comment) throw new APIError("can't find comment", 404);
        return comment
    }
}