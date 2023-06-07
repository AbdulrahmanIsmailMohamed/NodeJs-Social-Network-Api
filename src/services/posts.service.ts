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

export class PostService {
    private senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData()
    }

    createPost = async (postBody: CreatePost, imagePath?: any): Promise<PostSanitize> => {
        const { images } = postBody;

        if (images) {
            const imageUrl: any = [];
            imagePath.forEach(async (image: any) => {
                const result = await (await errorHandling(
                    cloudinary.uploader.upload(
                        image,
                        {
                            folder: "uploads/posts",
                            format: "jpg",
                            public_id: `${Date.now()}-posts`
                        }
                    )
                ) as Promise<UploadApiResponse>);
                imageUrl.push(result.url);
            });
            postBody.images = imageUrl;
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

    getFriendsPosts = async (features: Features): Promise<GetAPIFeaturesResult> => {
        const { userId } = features;

        const user = await errorHandling(
            User.findById(userId)
                .populate({
                    path: "friends",
                    match: { active: { $eq: true } }
                })
        ) as any;
        if (!user) throw new APIError(`Not Found User for this id: ${userId}`, 404);

        const query = {
            userId: { $in: user.friends },
            $or: [
                { postType: "public" },
                { postType: "friends" }
            ],
        }

        const countPosts = await errorHandling(Post.countDocuments(query)) as number;

        const apiFeature = new APIFeature(Post.find(query), features)
            .pagination(countPosts);

        const result = await errorHandling(apiFeature.execute("posts")) as GetAPIFeaturesResult;
        return result
    }
}