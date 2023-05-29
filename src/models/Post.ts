import { PostInterface } from "interfaces/post.interface";
import { Schema, model } from "mongoose";

const postShema = new Schema<PostInterface>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: String,
            minlength: 1,
            required: true
        },
        postType: {
            type: String,
            required: true,
            default: "friends",
            enum: ["friends", "public", "private"]
        },
        image: {
            type: String,
            default: "photo.jpeg"
        },
        fans: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        likes: {
            type: Number,
            default: 0
        },
        share: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const Post = model<PostInterface>("Post", postShema);

export default Post;