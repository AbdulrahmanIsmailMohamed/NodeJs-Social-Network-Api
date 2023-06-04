import { Schema, model } from "mongoose";

import { IComment } from "../interfaces/comments.interface";

const commentSchema = new Schema<IComment>(
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
            minlength: 1,
            maxlength: 1000,
            required: true
        },
        likes: {
            type: Number,
            default: 0
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
                minlength: 1,
                maxlength: 1000,
                required: true
            },
            likes: {
                type: Number,
                default: 0
            },
            image: {
                type: String,
                default: "image.jpeg"
            },
        }]
    },
    { timestamps: true }
);

commentSchema.pre(/^find/, function () {
    this.select("-__v")
});

export const Comment = model<IComment>("Comment", commentSchema);