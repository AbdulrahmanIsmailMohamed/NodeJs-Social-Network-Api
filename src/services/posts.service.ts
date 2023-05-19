import APIError from "../utils/apiError";
import Post from "../models/Post"
import { errorHandling } from "../utils/errorHandling"
import SenitizeData from "../utils/senitizeData";
import { APIFeature } from "../utils/apiFeature";
import User from '../models/User';
import { PostInterface } from '../interfaces/post.interface';

export class PostService {
    private senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData()
    }

    createPost = async (postData: any): Promise<any> => {
        const post = await errorHandling(Post.create(postData));
        if (!post) throw new APIError("Can't create post", 400);
        return this.senitizeData.post(post);
    }

    updatePost = async (data: any): Promise<any> => {
        const post = await errorHandling(
            Post.findOneAndUpdate(
                {
                    _id: data.postId,
                    userId: data.userId
                },
                {
                    post: data.body.post,
                    postType: data.body.postType
                },
                { new: true }
            )
        );
        if (!post) throw new APIError("Can't update post", 400);
        return this.senitizeData.post(post)
    }

    deletePost = async (data: any): Promise<string> => {
        const post = await errorHandling(
            Post.findOneAndDelete({ _id: data.postId, userId: data.userId })
        );
        if (!post) throw new APIError("Can't delete post", 400);
        return "Done"
    }

    getLoggedUserPosts = async (features: any) => {
        const { userId } = features;
        const countDocument = await errorHandling(
            Post.countDocuments({ userId })
        );
        const apiFeature = new APIFeature(Post.find({ userId }), features)
            .pagination(countDocument);
        const result = await errorHandling(apiFeature.exic("posts"));
        return result;
    }

    getUserPosts = async (features: any) => {
        const { userId, friendId } = features;
        const isUserFriend = await errorHandling(
            User.exists({ _id: userId, friends: friendId })
                .lean()
        )
        const query: any = {
            userId: friendId,
            postType: isUserFriend ? { $in: ["public", "friends"] } : "public"
        };

        const countDocument = await errorHandling(Post.countDocuments(query));
        const apiFeature = new APIFeature(Post.find(query), features)
            .pagination(countDocument);
        const result = await errorHandling(apiFeature.exic("posts"));
        return result;
    }

    getFriendsPosts = async (features: any) => {
        const { userId } = features;

        const user = await errorHandling(
            User.findById(userId)
                .populate({
                    path: "friends",
                    match: { active: { $eq: true } }
                })
        );
        if (!user) throw new APIError(`Not Found User for this id: ${userId}`, 404);
        const query = {
            userId: { $in: user.friends },
            $or: [
                { postType: "public" },
                { postType: "friends" }
            ],
        }
        const countPosts = await errorHandling(Post.countDocuments(query));

        const apiFeature = new APIFeature(Post.find(query), features)
            .pagination(countPosts);
        const result = await apiFeature.exic("posts")

        return result
    }
}