import { Schema, model } from "mongoose";
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
            select: true,
            default: true
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

const User = model("User", userSchema);

export default User;