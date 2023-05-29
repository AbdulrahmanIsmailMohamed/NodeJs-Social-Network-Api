import { NextFunction, Response } from "express";

import { PostService } from "../services/posts.service";
import { asyncHandler } from "../middlewares/asyncHandlerMW";
import APIError from "../utils/apiError";
import AuthenticatedRequest from "../interfaces/authenticatedRequest.interface";
import { Features, PostInterface } from "../interfaces/post.interface";
import Post from "../models/Post";

export class PostController {
    private postService: PostService;
    constructor() {
        this.postService = new PostService(Post);
    }

    createPost = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        req.user ?
            req.body.userId = req.user._id
            : next(new APIError("Please login", 401));

        const { post, postType, userId, image }: PostInterface = req.body;
        const result = await this.postService.createPost(post, postType, userId, image);
        if (!result) return next(new APIError("Can't create post", 400));
        res.status(201).json({ status: "Success", result })
    });

    // updatePost = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //     const data = {
    //         postId: req.params.id,
    //         userId: req.user._id,
    //         body: req.body
    //     }
    //     const post = await this.postService.updatePost(data);
    //     if (!post) return next(new APIError("Can't update post", 400));
    //     res.status(200).json({ status: "Success", post });
    // });

    // deletePost = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //     const data = {
    //         postId: req.params.id,
    //         userId: req.user._id
    //     }
    //     const post = await this.postService.deletePost(data);
    //     if (!data) return next(new APIError("can't delete post", 400));
    //     res.status(204).json({ status: "Success", message: post });
    // });

    // getLoggedUserPosts = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //     const features: Features = {
    //         limit: parseInt(req.query.limit as string) * 1 || 5,
    //         page: parseInt(req.query.page as string) * 1 || 1,
    //     };

    //     if (req.user) {
    //         features.userId = req.user._id
    //     }

    //     const result = await this.postService.getLoggedUserPosts(features);
    //     if (!result) return next(new APIError("Can't find posts", 404));
    //     const { paginationResult, posts } = result;

    //     res.status(200).json({
    //         status: "Success",
    //         paginationResult,
    //         posts
    //     });
    // });

    // getUserPosts = asyncHandler(
    //     async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //         const features = {
    //             limit: parseInt(req.query.limit as string) * 1 || 5,
    //             page: parseInt(req.query.page as string) * 1 || 1,
    //             userId: req.user._id,
    //             friendId: req.params.userId
    //         };
    //         const result = await this.postService.getUserPosts(features);
    //         if (!result) return next(new APIError("Can't find posts", 404));
    //         const { paginationResult, posts } = result;
    //         res.status(200)
    //             .json({
    //                 status: "Success",
    //                 paginationResult,
    //                 posts
    //             });
    //     }
    // );

    // getFrinedsPosts = asyncHandler(
    //     async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //         const features = {
    //             limit: parseInt(req.query.limit as string) * 1 || 5,
    //             page: parseInt(req.query.page as string) * 1 || 1,
    //             userId: req.user._id
    //         };
    //         const result = await this.postService.getFriendsPosts(features);
    //         if (!result) return next(new APIError("Can't find posts for this user", 404));
    //         const { paginationResult, posts } = result;
    //         res.status(200)
    //             .json({
    //                 status: "Success",
    //                 paginationResult,
    //                 posts
    //             })
    //     }
    // );
} 