import { Schema, model } from "mongoose";

import { IPost } from "../interfaces/post.interface";

const postShema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: String,
      minlength: 1,
      required: true,
    },
    postType: {
      type: String,
      required: true,
      default: "friends",
      enum: ["friends", "public", "private"],
    },
    media: { type: Array },
    fans: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    share: {
      type: Number,
      default: 0,
    },
    sharePost: {
      post: {
        type: String,
      },
      sharePostId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
      ownerPost: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      media: { type: Array },
    },
  },
  { timestamps: true }
);

const Post = model<IPost>("Post", postShema);

export default Post;
