import { Model, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

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
            required: true,
            unique: true
        },
        address: {
            type: String,
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
            ref: "User",
            maxlength: 2
        }],
        friendshipRequests: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        myFriendshipRequests: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        active: {
            type: Boolean,
            default: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

userSchema.pre("save", function (next) {
    if (this.isNew || this.isModified(this.password)) {
        this.password = bcrypt.hashSync(this.password, 12);
    }
    next();
});

userSchema.pre(/^find/, function (next) {
    this.select("-__v");
    next()
});

const User: Model<UserInterface> = model<UserInterface>("User", userSchema);

export default User;