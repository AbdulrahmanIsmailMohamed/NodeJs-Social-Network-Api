import { Schema, model } from "mongoose";

import { CommentsInterface } from "../interfaces/comments.interface";

const commentSchema = new Schema<CommentsInterface>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        comment: {
            type: String,
            maxlength: 1000,
            required: true
        },
        image: {
            type: String,
            default: "image.jpeg"
        },
        reply: [{
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            comment: {
                type: String,
                maxlength: 1000,
                required: true
            },
            image: {
                type: String,
                default: "image.jpeg"
            },
        }]
    },
    { timestamps: true }
);

export const Comment = model("Comment", commentSchema);