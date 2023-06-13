import { UploadApiResponse } from "cloudinary";

import APIError from "../utils/apiError";
import Post from "../models/Post"
import { errorHandling } from "../utils/errorHandling"
import SenitizeData from "../utils/sanitizeData";
import { APIFeature } from "../utils/apiFeature";
import User from '../models/User';
import cloudinary from '../config/coludinaryConfig';

import {
    CreatePost,
    DeletePost,
    Features,
    PostSanitize,
    UpdatePost,
    GetAPIFeaturesResult,
} from '../interfaces/post.interface';
import { IUser } from "../interfaces/user.Interface";

export class PostService {
    private senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData()
    }

    createPost = async (postBody: CreatePost, mediaPath?: any): Promise<PostSanitize> => {
        if (mediaPath) {
            const mediaUrl: any = [];
            let format: string = "";

            for (const media of mediaPath) {
                if (media.mimetype.startsWith('image')) {
                    format = 'jpg'; // Set the format to 'jpg' for image uploads
                } else if (media.mimetype.startsWith('video')) {
                    format = 'mp4'; // Set the format to 'mp4' for video uploads

                } else if (media.mimetype.startsWith('application/pdf')) {
                    format = 'pdf'; // Set the format to 'mp4' for video uploads
                }

                const result = await errorHandling(
                    cloudinary.uploader.upload(media.path, {
                        folder: "uploads/posts",
                        format,
                        public_id: `${Date.now()}-posts`,
                        resource_type: format === 'mp4' ? 'video' : 'image',
                    })
                ) as UploadApiResponse;
                mediaUrl.push(result.url);
            }

            postBody.media = mediaUrl;
        }

        const newPost = await errorHandling(Post.create(postBody)) as PostSanitize;
        if (!newPost) throw new APIError("Can't create post", 400);
        return this.senitizeData.post(newPost);
    }

    updatePost = async (postBody: UpdatePost): Promise<PostSanitize> => {
        const { post, userId, postType, postId } = postBody

        const updatePost = await errorHandling(
            Post.findOneAndUpdate(
                {
                    _id: postId,
                    userId
                },
                {
                    post,
                    postType
                },
                { new: true }
            )
        ) as PostSanitize;
        if (!updatePost) throw new APIError("Can't update post", 400);
        return this.senitizeData.post(updatePost)
    }

    deletePost = async (postBody: DeletePost): Promise<string> => {
        const { postId, userId } = postBody;

        const post = await errorHandling(
            Post.findOneAndDelete({ _id: postId, userId })
        ) as PostSanitize;
        if (!post) throw new APIError("Can't delete post", 400);
        return "Done"
    }

    getLoggedUserPosts = async (features: Features): Promise<GetAPIFeaturesResult> => {
        const { userId } = features;

        const countDocument: number = await errorHandling(
            Post.countDocuments({ userId })
        ) as number;

        const apiFeature = new APIFeature(Post.find({ userId }), features)
            .pagination(countDocument);

        const result = await errorHandling(apiFeature.execute("posts")) as GetAPIFeaturesResult;
        return result;
    }

    getUserPosts = async (features: Features): Promise<GetAPIFeaturesResult> => {
        const { userId, friendId } = features;

        const user = await errorHandling(User.findById(userId).select("friends")) as any;
        if (!user) throw new APIError("Not Found", 404);

        const isUserFriend: boolean = user.friends.includes(friendId);

        const query = {
            userId: friendId,
            postType: { $in: isUserFriend ? ["public", "friends"] : "public" }
        };

        const countDocument = await errorHandling(Post.countDocuments(query)) as number;
        const apiFeature = new APIFeature(Post.find(query), features)
            .pagination(countDocument);
        const result = await errorHandling(apiFeature.execute("posts")) as GetAPIFeaturesResult;

        return result;
    }

    hideUserPosts = async (postId: string, userId: string): Promise<string> => {
        const post = await errorHandling(Post.findById(postId).select("userId")) as PostSanitize;
        if (!post) throw new APIError("Can't find post!", 404);

        // add userId to hideUserPosts Array
        const user = await errorHandling(
            User.findByIdAndUpdate(
                userId,
                { $addToSet: { hideUserPosts: post.userId } },
                { new: true }
            ).select("hideUserPosts")
        ) as IUser;
        if (!user) throw new APIError("Can't find User!", 404);

        // after 1 month userId will delete from hideUserPosts
        const thirtyDaysInMilliseconds = 24 * 60 * 60 * 1000;
        setTimeout(async () => {
            const user = await errorHandling(
                User.findByIdAndUpdate(
                    userId,
                    { $pull: { hideUserPosts: post.userId } },
                    { new: true }
                ).select("hideUserPosts")
            ) as IUser;
            if (!user) throw new APIError("Occur Error!!", 400);
            return "Done"
        }, thirtyDaysInMilliseconds);

        return "Done"
    }

    renderTimeline = async (features: Features): Promise<GetAPIFeaturesResult> => {
        const { userId } = features;

        const user = await errorHandling(
            User.findOne({ _id: userId })
                .populate({
                    path: "friends",
                    match: { active: { $eq: true } }
                })
        ) as any;
        if (!user) throw new APIError(`Not Found User for this id: ${userId}`, 404);

        const query = {
            $or: [
                {
                    $and: [
                        { postType: "public" },
                        {
                            userId: {
                                $in: [...user.friends, ...user.followUsers],
                                $nin: user.hideUserPosts
                            }
                        }
                    ]
                },
                {
                    $and: [
                        { postType: "friends" },
                        {
                            userId: {
                                $in: user.friends,
                                $nin: user.hideUserPosts
                            }
                        }
                    ]
                }
            ]
        };

        const countPosts = await errorHandling(Post.countDocuments(query)) as number;

        const apiFeature = new APIFeature(Post.find(query), features)
            .pagination(countPosts);

        const result = await errorHandling(apiFeature.execute("posts")) as GetAPIFeaturesResult;
        return result;
    }
}