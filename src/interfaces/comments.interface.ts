import { Document, ObjectId } from "mongoose";

export interface CommentsInterface extends Document {
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