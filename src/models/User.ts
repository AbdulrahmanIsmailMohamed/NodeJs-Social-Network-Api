import { Schema, model } from "mongoose";

import UserInterface from "interfaces/user.Interface";

const userSchema = new Schema<UserInterface>(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        profileImage: {
            type: String,
            default: "image.jpeg"
        },
        friends: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        friendsRequest: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        active: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const User = model("User", userSchema);

export default User;