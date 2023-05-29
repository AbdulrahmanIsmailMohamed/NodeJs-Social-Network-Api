import { ObjectId } from "mongoose";
import { Paginate } from "./paginate.interface";

export interface IPost {
    userId: ObjectId,
    post: string,
    postType: string,
    image?: string,
    likes?: number[],
    fans?: string[],
    share?: number[],
}

export interface CreatePost {
    post: string,
    postType: string,
    userId: string,
    image?: string
}

export interface UpdatePost extends CreatePost {
    postId: string
}

export interface DeletePost extends Partial<UpdatePost> { };

export interface PostSanitize extends IPost {
    _id: string
}

export interface Features {
    page: number,
    limit: number,
    userId?: string,
    friendId?: string,
}

export interface GetAPIFeaturesResult {
    paginationResult: Paginate,
    data: PostSanitize[]
}