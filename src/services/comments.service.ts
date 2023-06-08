import { UploadApiResponse } from "cloudinary";

import APIError from "../utils/apiError";
import { Comment } from "../models/Comments"
import { errorHandling } from "../utils/errorHandling"
import SenitizeData from '../utils/sanitizeData';
import { APIFeature } from "../utils/apiFeature";
import { Features } from "../interfaces/post.interface";
import cloudinary from '../config/coludinaryConfig';

import {
    CommentSanitize,
    CreateComment,
    DeleteComment,
    GetAPIFeaturesResult,
    UpdateComment
} from "../interfaces/comments.interface";

export class CommentService {
    private senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData();
    }

    createComment = async (commentBody: CreateComment, imagePath: string | undefined): Promise<CommentSanitize> => {
        if (imagePath) {
            const result = await (await errorHandling(
                cloudinary.uploader.upload(
                    imagePath,
                    {
                        folder: "uploads/comments",
                        format: "jpg",
                        public_id: `${Date.now()}-comment`
                    }
                )
            ) as Promise<UploadApiResponse>);

            if (!result) throw new APIError("Internal Server Error", 500);
            commentBody.image = result.url;
        }

        const comment = await errorHandling(
            (await Comment.create(commentBody))
                .populate("userId", "name imageProfile")
        ) as CommentSanitize;
        if (!comment) throw new APIError("Can't create comment", 400);
        return this.senitizeData.comments(comment);
    }

    updateComment = async (commentData: UpdateComment): Promise<CommentSanitize> => {
        const { commentId, userId, commentBody } = commentData;

        const updateComment = await errorHandling(
            Comment.findOneAndUpdate(
                {
                    _id: commentId,
                    userId
                },
                commentBody,
                { new: true }
            ).populate("userId", "name profileImage")
        ) as CommentSanitize;
        if (!updateComment) throw new APIError("Can't find this comment", 404);
        return updateComment
    }

    deleteComment = async (commentData: DeleteComment): Promise<string> => {
        const { commentId, userId } = commentData;

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

    getPostComments = async (features: Features): Promise<GetAPIFeaturesResult> => {
        const { postId } = features;
        const countDocuments = await errorHandling(Comment.countDocuments({ postId })) as number;
        if (!countDocuments) throw new APIError("can't find comments", 404);

        const apiFeatures = new APIFeature(Comment.find({ postId }), features)
            .pagination(countDocuments);

        const comments = await errorHandling(apiFeatures.execute("posts")) as GetAPIFeaturesResult;
        if (!comments) throw new APIError("Can't find comments", 404)
        return comments
    }

    getComment = async (commentId: string): Promise<CommentSanitize> => {
        const comment = await errorHandling(
            Comment.findById(commentId).populate("userId", "name profileImage")
        ) as CommentSanitize;

        if (!comment) throw new APIError("can't find comment", 404);
        return this.senitizeData.comments(comment)
    }
}