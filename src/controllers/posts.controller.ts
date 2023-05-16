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

    getUserPosts = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const features = {
            limit: req.query.limit || 5,
            page: parseInt(req.query.page as string) * 1 || 1,
            userId: req.user._id
        };
        const data = await this.postService.getUserPosts(features);
        if (!data) return next(new APIError("Can't find posts", 404));
        res.status(200)
            .json({
                status: "Success",
                paginationResult: {
                    countDocumnt: data.posts.length,
                    ...data.paginationResult
                },
                posts: data.posts
            });
    });

    getPosts = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userPost = await this.postService.getPosts(req.user._id);
        res.json(userPost)
    })
} 