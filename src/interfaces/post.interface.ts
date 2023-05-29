import { Document, ObjectId } from "mongoose";
import { Paginate } from "./paginate.interface";

export interface PostInterface extends Document {
    userId: ObjectId,
    post: string,
    image: string,
    postType: string,
    likes?: number,
    fans?: [ObjectId],
    share?: number
}

export interface Features {
    page: number,
    limit: number,
    userId?: string,
}

export interface GetLoggedUserPostsResult {
    paginationResult: Paginate,
    posts: PostInterface[]
}