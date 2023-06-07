import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

import { IUser } from "../interfaces/user.Interface";

const userSchema = new Schema<IUser>(
    {
        name: {
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
            default: "https://res.cloudinary.com/dqm9gatsb/image/upload/v1686079717/uploads/profileImages/profiledefault_qecqpj.png"
        },
        profileImages: { type: Array },
        friends: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            maxlength: 5000
        }],
        friendshipRequests: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            maxlength: 5000
        }],
        myFriendshipRequests: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            maxlength: 5000
        }],
        limitFriends: {
            type: Number,
            default: 0
        },
        limitFriendshipRequest: {
            type: Number,
            default: 0
        },
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
    if (this.isNew || !this.isModified(this.password)) {
        this.password = bcrypt.hashSync(this.password, 12);
    }
    next();
});

userSchema.pre(/^find/, function (next) {
    this.select("-__v");
    next()
});

const User = model<IUser>("User", userSchema);

export default User;