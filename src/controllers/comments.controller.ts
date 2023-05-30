import { NextFunction, Request, Response } from "express";

import { asyncHandler } from "../middlewares/asyncHandlerMW";
import { CommentService } from "../services/comments.service";
import APIError from "../utils/apiError";
import AuthenticatedRequest from "../interfaces/authentication.interface";

export class CommentController {
    private commentService: CommentService;
    constructor() {
        this.commentService = new CommentService()
    }

    createComment = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        req.body.postId = req.params.postId;
        const commentBody = {
            userId: req.user._id,
            ...req.body
        }
        const comment = await this.commentService.createComment(commentBody);
        if (!comment) return next(new APIError("Can't create comment", 400));
        res.status(201).json({ status: "Success", comment });
    });

    updateComment = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const data = {
            commentId: req.params.id,
            userId: req.user._id,
            commentBody: { ...req.body }
        }
        const comment = await this.commentService.updateComment(data);
        if (!comment) return next(new APIError("can't find this comment", 404));
        res.status(200).json({ status: "Success", comment });
    });

    deleteComment = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const data = {
            commentId: req.params.id,
            userId: req.user._id
        }
        const comment = await this.commentService.deleteComment(data);
        if (!comment) return next(new APIError("can't delete comment", 400));
        res.status(204).json({ status: "Success", message: comment })
    });

    getPostComments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const features = {
            limit: parseInt(req.query.limit as string) * 1 || 5,
            page: parseInt(req.query.page as string) * 1 || 1,
            postId: req.params.postId
        };

        const comments = await this.commentService.getPostComments(features);
        if (!comments) return next(new APIError("can't find comments", 404));
        const { paginationResult, posts } = comments;
        res.status(200)
            .json({
                status: "Success",
                paginationResult,
                posts
            })
    });

    getComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const commentId = req.params.id

        const comment = await this.commentService.getComment(commentId);
        if (!comment) return next(new APIError("can't find comment", 404));
        res.status(200).json({ status: "Success", comment });
    });
}