import { NextFunction, Request, Response } from "express";

import { PostService } from "../services/posts.service";
import { asyncHandler } from "../middlewares/asyncHandlerMW";
import APIError from "../utils/apiError";
import AuthenticatedRequest from "../interfaces/authenticatedRequest.interface";

export class PostController {
    private postService: PostService;
    constructor() {
        this.postService = new PostService();
    }

    createPost = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        req.body.userId = req.user._id;
        const post = await this.postService.createPost(req.body);
        if (!post) return next(new APIError("Can't create post", 400));
        res.status(201).json({ status: "Success", post })
    });

    updatePost = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const data = {
            postId: req.params.id,
            userId: req.user._id,
            body: req.body
        }
        const post = await this.postService.updatePost(data);
        if (!post) return next(new APIError("Can't update post", 400));
        res.status(200).json({ status: "Success", post });
    });

    deletePost = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const data = {
            postId: req.params.id,
            userId: req.user._id
        }
        const post = await this.postService.deletePost(data);
        if (!data) return next(new APIError("can't delete post", 400));
        res.status(204).json({ status: "Success", message: post });
    });

    getUserPost = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const features = {
            limit: req.query.limit || 5,
            page: parseInt(req.query.page as string) * 1 || 1,
            userId: req.params.userId ? req.params.userId : req.user._id
        };
        console.log(features);
        
        const result = await this.postService.getUserPost(features);
        if (!result) return next(new APIError("Can't find posts", 404));
        const { paginationResult, posts } = result;
        res.status(200)
            .json({
                status: "Success",
                paginationResult,
                posts
            });
    });

    getFrinedsPosts = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const features = {
            limit: req.query.limit || 5,
            page: parseInt(req.query.page as string) * 1 || 1,
            userId: req.user._id
        };
        const result = await this.postService.getFriendsPosts(features);
        if (!result) return next(new APIError("Can't find posts for this user", 404));
        const { paginationResult, posts } = result;
        res.status(200)
            .json({
                status: "Success",
                paginationResult,
                posts
            })
    })
} 