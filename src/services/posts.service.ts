import APIError from "../utils/apiError";
import Post from "../models/Post"
import { errorHandling } from "../utils/errorHandling"
import SenitizeData from "../utils/sanitizeData";
import { APIFeature } from "../utils/apiFeature";
import User from '../models/User';
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

    createPost = async (postBody: CreatePost): Promise<PostSanitize> => {
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

        const isUserFriend = await errorHandling(User.exists({ _id: userId, friends: friendId }).lean()) as any;

        const query = {
            userId: friendId,
            postType: isUserFriend ? { $in: ["public", "friends"] } : "public"
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