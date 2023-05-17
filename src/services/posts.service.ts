import APIError from "../utils/apiError";
import Post from "../models/Post"
import { errorHandling } from "../utils/errorHandling"
import SenitizeData from "../utils/senitizeData";
import { APIFeature } from "../utils/apiFeature";
import User from '../models/User';
import { query } from "express";
import { features } from "process";

export class PostService {
    private senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData()
    }

    createPost = async (postData: any) => {
        const post = await errorHandling((Post.create(postData)));
        if (!post) throw new APIError("Can't create post", 400);
        return this.senitizeData.post(post);
    }

    updatePost = async (data: any) => {
        const post = await errorHandling(
            Post.findOneAndUpdate(
                {
                    _id: data.postId,
                    userId: data.userId
                },
                data.body,
                { new: true }
            )
        );
        if (!post) throw new APIError("Can't update post", 400);
        return this.senitizeData.post(post)
    }

    deletePost = async (data: any) => {
        const post = await errorHandling(
            Post.findOneAndDelete({ _id: data.postId, userId: data.userId })
        );
        if (!post) throw new APIError("Can't delete post", 400);
        return "Done"
    }

    getUserPosts = async (features: any) => {
        const countDocument = await errorHandling(Post.countDocuments({ userId: features.userId }))
        const apiFeature = new APIFeature(Post.find({ userId: features.userId }), features)
            .pagination(countDocument);
        const data = await apiFeature.exic("post");
        return data;
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
        // const userPost = await errorHandling(
        //     Post.find(query)
        //         .populate({
        //             path: "userId",
        //             select: "firstName lastName profileImage",
        //         })
        // );
        const countPosts = await errorHandling(Post.countDocuments(query));
        console.log(countPosts);
        
        const apiFeature = new APIFeature(Post.find(query), features)
            .pagination(countPosts);
        const result = await apiFeature.exic("posts")

        return result
    }
}