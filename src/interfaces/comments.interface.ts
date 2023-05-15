import { Document, ObjectId } from "mongoose";

export interface CommentsInterface extends Document {
    userId: ObjectId,
    postId: ObjectId,
    comment: string,
    image?: string,
    reply?: {
        userId: ObjectId,
        comment: string,
        image?: string,
    }
}