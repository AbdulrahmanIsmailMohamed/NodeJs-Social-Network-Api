import APIError from "../utils/apiError";
import Post from "../models/Post"
import { errorHandling } from "../utils/errorHandling"
import SenitizeData from "../utils/senitizeData";
import { APIFeature } from "../utils/apiFeature";
import User from '../models/User';
import { query } from "express";

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

    getPosts = async (userId: any) => {
        
        const query = {
            $or: [{ postType: "public" }, { postType: "friends" }],
            // "userId.frinds": userId
        }
        const userPost = await errorHandling(
            Post.find(query)
                .populate({ path: "userId", match: { friends: userId } })
        )
        // const countDocument = await errorHandling(Post.countDocuments({ userId: features.userId }))
        // const newPosts: any[] = []

        // userPost.forEach((post: any) => {
        //     if (post.userId.friends.includes(features.toString())) {
        //         newPosts.push(post);
        //     }
        // })
        // console.log(newPosts);

        return userPost
    }
}