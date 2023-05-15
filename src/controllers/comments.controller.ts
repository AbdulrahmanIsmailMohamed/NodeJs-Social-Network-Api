import { NextFunction, Request, Response } from "express";

import { asyncHandler } from "../middlewares/asyncHandlerMW";
import { CommentService } from "../services/comments.service";
import APIError from "../utils/apiError";
import AuthenticatedRequest from "../interfaces/authenticatedRequest.interface";

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
        console.log(commentBody);
        const comment = await this.commentService.createComment(commentBody);
        if (!comment) return next(new APIError("Can't create comment", 400));
        res.status(201).json({ status: "Success", comment });
    });

    updateComment = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const data = {
            commentId: req.params.id,
            userId: req.user._id,
            postId: req.body.postId,
            commentBody: { ...req.body }
        }
        const comment = await this.commentService.updateComment(data);
        if (!comment) return next(new APIError("can't update comment", 400));
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

    getComments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const comments = await this.commentService.getComments(req.params.postId);
        if (!comments) return next(new APIError("can't find comments", 404));
        res.status(200).json({ status: "Success", comments });
    });

    getComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const data = {
            commentId: req.params.id,
            postId: req.body.postId
        }
        const comment = await this.commentService.getComment(data);
        if (!comment) return next(new APIError("can't find comment", 404));
        res.status(200).json({ status: "Success", comment });
    });
}