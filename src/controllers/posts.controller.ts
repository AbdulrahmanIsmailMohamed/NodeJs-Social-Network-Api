import { NextFunction, Response } from "express";

import { PostService } from "../services/posts.service";
import { asyncHandler } from "../middlewares/asyncHandlerMW";
import APIError from "../utils/apiError";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";
import {
  CreatePost,
  DeletePost,
  Features,
  SharePost,
  UpdatePost,
} from "../interfaces/post.interface";

export class PostController {
  private postService: PostService;
  constructor() {
    this.postService = new PostService();
  }

  createPost = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const postBody: CreatePost = {
          userId: req.user._id as string,
          post: req.body.post,
          postType: req.body.postType,
        };
        const mediaPath = req.files as Array<Express.Multer.File>;

        const result = await this.postService.createPost(postBody, mediaPath);
        if (!result) return next(new APIError("Can't create post", 400));
        res.status(201).json({ status: "Success", post: result });
      } else next(new APIError("Please login", 401));
    }
  );

  updatePost = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const postBody: UpdatePost = {
          postId: req.params.id as string,
          userId: req.user._id as string,
          post: req.body.post,
          postType: req.body.postType,
        };
        const result = await this.postService.updatePost(postBody);
        if (!result) return next(new APIError("Can't update post", 400));

        res.status(200).json({ status: "Success", post: result });
      } else return next(new APIError("Please login", 401));
    }
  );

  deletePost = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const postBody: DeletePost = {
          postId: req.params.id,
          userId: req.user._id,
        };

        const result = await this.postService.deletePost(postBody);
        if (!result) return next(new APIError("can't delete post", 400));

        res.status(204).json({ status: "Success", message: result });
      } else next(new APIError("Please login", 401));
    }
  );

  getLoggedUserPosts = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const features: Features = {
          limit: parseInt(req.query.limit as string) * 1 || 5,
          page: parseInt(req.query.page as string) * 1 || 1,
          userId: req.user._id,
        };

        const result = await this.postService.getLoggedUserPosts(features);
        if (!result) return next(new APIError("Can't find posts", 404));
        const { paginationResult, data } = result;

        res.status(200).json({
          status: "Success",
          paginationResult,
          posts: data,
        });
      } else return next(new APIError("Please login", 401));
    }
  );

  getUserPosts = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const features: Features = {
          limit: parseInt(req.query.limit as string) * 1 || 5,
          page: parseInt(req.query.page as string) * 1 || 1,
          userId: req.user._id as string,
          friendId: req.params.userId,
        };
        const result = await this.postService.getUserPosts(features);
        if (!result) return next(new APIError("Can't find posts", 404));
        const { paginationResult, data } = result;
        res.status(200).json({
          status: "Success",
          paginationResult,
          posts: data,
        });
      } else return next(new APIError("Please login", 401));
    }
  );

  hideUserPosts = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const userId = req.user._id as string;
        const postId: string = req.params.id;

        const user = await this.postService.hideUserPosts(postId, userId);
        if (!user) return next(new APIError("Occur Error!!", 400));
        res.status(200).json({ status: "Success", message: user });
      } else next(new APIError("Please login", 401));
    }
  );

  renderTimeline = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const features: Features = {
          limit: parseInt(req.query.limit as string) * 1 || 5,
          page: parseInt(req.query.page as string) * 1 || 1,
          userId: req.user._id,
        };

        const result = await this.postService.renderTimeline(features);
        if (!result) {
          return next(new APIError("Can't find posts for this user", 404));
        }
        const { paginationResult, data } = result;

        res.status(200).json({
          status: "Success",
          paginationResult,
          posts: data,
        });
      } else return next(new APIError("Please login", 401));
    }
  );

  sharePost = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const sharePostData: SharePost = {
          post: req.body.post,
          postType: req.body.postType,
          sharePostId: req.params.sharePostId,
          userId: req.user._id as string,
        };

        const sharePost = await this.postService.sharePost(sharePostData);
        res.status(201).json({ status: "Success", post: sharePost });
      } else return next(new APIError("you not reqister, please login", 401));
    }
  );

  postsCreatedOnTheSameDay = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const userId = req.user._id as string;

        const posts = await this.postService.postsCreatedOnTheSameDay(userId);
        res.status(200).json({ status: "Success", posts });
      } else return next(new APIError("you not reqister, please login", 401));
    }
  );
}
