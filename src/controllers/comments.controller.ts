import { NextFunction, Request, Response } from "express";

import { asyncHandler } from "../middlewares/asyncHandlerMW";
import { CommentService } from "../services/comments.service";
import APIError from "../utils/apiError";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";
import { CommentSanitize, CreateComment, DeleteComment, GetAPIFeaturesResult, UpdateComment } from "../interfaces/comments.interface";
import { Features } from "../interfaces/post.interface";

export class CommentController {
    private commentService: CommentService;
    constructor() {
        this.commentService = new CommentService()
    }

    createComment = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const commentBody: CreateComment = {
                userId: req.user._id as string,
                postId: req.params.postId as string,
                comment: req.body.comment,
                image: req.body.image
            }
            const comment: CommentSanitize = await this.commentService.createComment(commentBody);
            if (!comment) return next(new APIError("Can't create comment", 400));
            res.status(201).json({ status: "Success", comment });
        }
        else return next(new APIError("Please Login", 401));
    });

    updateComment = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const commentData: UpdateComment = {
                commentId: req.params.id,
                userId: req.user._id as string,
                commentBody: {
                    comment: req.body.comment,
                    image: req.body.image
                }
            }
            const comment: CommentSanitize = await this.commentService.updateComment(commentData);
            if (!comment) return next(new APIError("can't find this comment", 404));
            res.status(200).json({ status: "Success", comment });
        }
        else return next(new APIError("Please Login", 401));

    });

    deleteComment = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const commentData: DeleteComment = {
                commentId: req.params.id,
                userId: req.user._id as string
            }
            const comment:string = await this.commentService.deleteComment(commentData);
            if (!comment) return next(new APIError("can't delete comment", 400));
            res.status(204).json({ status: "Success", message: comment })
        }
        else return next(new APIError("Please Login", 401));

    });

    getPostComments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const features: Features = {
            limit: parseInt(req.query.limit as string) * 1 || 5,
            page: parseInt(req.query.page as string) * 1 || 1,
            postId: req.params.postId
        };

        const comments:GetAPIFeaturesResult = await this.commentService.getPostComments(features);
        if (!comments) return next(new APIError("can't find comments", 404));
        const { paginationResult, data } = comments;
        res.status(200).json({
            status: "Success",
            paginationResult,
            posts: data
        });
    });

    getComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const commentId = req.params.id

        const comment:CommentSanitize = await this.commentService.getComment(commentId);
        if (!comment) return next(new APIError("can't find comment", 404));
        res.status(200).json({ status: "Success", comment });
    });
}