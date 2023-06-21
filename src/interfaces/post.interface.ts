import { ObjectId } from "mongoose";
import { Paginate } from "./paginate.interface";

export interface IPost {
    userId: ObjectId,
    post: string,
    postType: string,
    media?: string,
    likes?: number[],
    fans?: string[],
    share?: number,
    sharePost?: {
        post: string,
        ownerPost: ObjectId,
        sharePostId: ObjectId
    }
}

export interface CreatePost {
    post: string,
    postType: string,
    userId: string,
    media?: Array<string>
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
    keyword?: string,
    userId?: string,
    postId?: string,
    friendId?: string,
}

export interface GetAPIFeaturesResult {
    paginationResult: Paginate,
    data: PostSanitize[]
}

export interface SharePost extends CreatePost {
    sharePostId: string
}