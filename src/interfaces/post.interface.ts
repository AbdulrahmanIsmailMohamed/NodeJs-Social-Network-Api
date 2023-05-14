import { Document, ObjectId } from "mongoose";

export interface PostInterface extends Document {
    userId: ObjectId,
    post: string,
    image: string,
    postType: string,
    likes?: number,
    fans?: [ObjectId],
    share?: number
}