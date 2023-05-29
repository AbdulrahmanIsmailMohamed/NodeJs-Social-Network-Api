import APIError from "../utils/apiError";
import Post from "../models/Post"
import { errorHandling } from "../utils/errorHandling"
import SenitizeData from "../utils/senitizeData";
import { APIFeature } from "../utils/apiFeature";
import User from '../models/User';
import { Model } from "mongoose";

import { Features, GetLoggedUserPostsResult, PostInterface } from '../interfaces/post.interface';
import { ObjectId } from "mongoose";

export class PostService {
    private senitizeData: SenitizeData;
    postModel: Model<PostInterface>;
    constructor(postModel: Model<PostInterface>) {
        this.postModel = postModel
        this.senitizeData = new SenitizeData()
    }

    createPost = async (
        post: string,
        postType: string,
        userId: ObjectId,
        image: string
    ): Promise<{
        _id: ObjectId;
        userId: ObjectId;
        post: string;
        postType: string;
        image: string;
        likes: number | undefined;
        share: number | undefined;
    }> => {
        const postData = { post, postType, userId, image }
        const newPost: PostInterface = await errorHandling(this.postModel.create(postData)) as PostInterface;
        if (!newPost) throw new APIError("Can't create post", 400);
        return this.senitizeData.post(newPost);
    }

    // updatePost = async (data): Promise<any> => {
    //     const post = await errorHandling(
    //         Post.findOneAndUpdate(
    //             {
    //                 _id: data.postId,
    //                 userId: data.userId
    //             },
    //             {
    //                 post: data.body.post,
    //                 postType: data.body.postType
    //             },
    //             { new: true }
    //         )
    //     );
    //     if (!post) throw new APIError("Can't update post", 400);
    //     return this.senitizeData.post(post)
    // }

    // deletePost = async (data: any): Promise<string> => {
    //     const post = await errorHandling(
    //         Post.findOneAndDelete({ _id: data.postId, userId: data.userId })
    //     );
    //     if (!post) throw new APIError("Can't delete post", 400);
    //     return "Done"
    // }

    // getLoggedUserPosts = async (features: Features): Promise<GetLoggedUserPostsResult> => {
    //     const { userId } = features;
    //     const countDocument: number = await errorHandling(
    //         Post.countDocuments({ userId })
    //     ) as number;

    //     const apiFeature = new APIFeature(Post.find({ userId }), features)
    //         .pagination(countDocument);
    //     const result = await errorHandling(apiFeature.execute("posts"));
    //     return result as GetLoggedUserPostsResult;
    // }

    // getUserPosts = async (features: Features) => {
    //     const { userId, friendId } = features;
    //     const isUserFriend = await errorHandling(
    //         User.exists({ _id: userId, friends: friendId })
    //             .lean()
    //     )
    //     const query: any = {
    //         userId: friendId,
    //         postType: isUserFriend ? { $in: ["public", "friends"] } : "public"
    //     };

    //     const countDocument: any = await errorHandling(Post.countDocuments(query));
    //     const apiFeature = new APIFeature(Post.find(query), features)
    //         .pagination(countDocument);
    //     const result = await errorHandling(apiFeature.exic("posts"));
    //     return result;
    // }

    // getFriendsPosts = async (features: any) => {
    //     const { userId } = features;

    //     const user: any = await errorHandling(
    //         User.findById(userId)
    //             .populate({
    //                 path: "friends",
    //                 match: { active: { $eq: true } }
    //             })
    //     );
    //     if (!user) throw new APIError(`Not Found User for this id: ${userId}`, 404);
    //     const query = {
    //         userId: { $in: user.friends },
    //         $or: [
    //             { postType: "public" },
    //             { postType: "friends" }
    //         ],
    //     }
    //     const countPosts: any = await errorHandling(Post.countDocuments(query));

    //     const apiFeature = new APIFeature(Post.find(query), features)
    //         .pagination(countPosts);
    //     const result = await apiFeature.exic("posts")

    //     return result
    // }
}