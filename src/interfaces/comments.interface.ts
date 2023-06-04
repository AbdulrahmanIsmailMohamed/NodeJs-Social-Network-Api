import { ObjectId } from "mongoose";

import { Paginate } from "./paginate.interface";

export interface IComment {
    userId: ObjectId,
    postId: ObjectId,
    comment: string,
    likes?: number,
    image?: string,
    reply?: ReplyInterface[]
}

interface ReplyInterface {
    userId: ObjectId,
    comment: string,
    likes?: number
    image?: string,
}

export interface CreateComment {
    userId: string,
    postId: string,
    comment: string,
    image?: string
}

export interface CommentSanitize {
    _id: string,
    userId: user,
    postId: string,
    comment: string,
    image?: string,
    likes?: number,
    reply?: ReplyInterface[]
}

interface user {
    name: string,
    imageProfile: string
}

export interface UpdateComment {
    userId: string,
    commentId: string,
    commentBody?: {
        comment: string,
        image: string
    }
}

export interface DeleteComment {
    userId: string,
    commentId: string,
}

export interface GetAPIFeaturesResult {
    paginationResult: Paginate,
    data: CommentSanitize[]
}