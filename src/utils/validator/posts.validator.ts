import { check } from "express-validator";

import { validatorMW } from "../../middlewares/validatorMW";
import APIError from '../apiError';
import { errorHandling } from '../errorHandling';
import Post from '../../models/Post';
import { PostSanitize } from '../../interfaces/post.interface';
import { UserId } from "../../interfaces/user.Interface";

const postType = [
    "public",
    "private",
    "friends"
];

export const createPostValidator = [
    check("post")
        .notEmpty()
        .withMessage("The post is required")
        .isString()
        .withMessage("The post must be string")
        .isLength({ min: 1 })
        .withMessage("The post is must be at least 2 char"),
    check("postType")
        .custom((val) => {
            if (!postType.includes(val)) throw new APIError(`${val} not exist in post type keywords!!`, 404)
            return true;
        }),
    validatorMW
];

export const updatePostValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Post Id format!!")
        .custom(async (val, { req }) => {
            const isPostExist = await errorHandling(
                Post.exists({ _id: val, userId: req.user._id }).lean()
            );
            if (isPostExist) return true;
            throw new APIError("Your post not exist", 404);
        }),
    check("post")
        .optional()
        .notEmpty()
        .withMessage("The post is required")
        .isString()
        .withMessage("The post must be string")
        .isLength({ min: 1 })
        .withMessage("The post is must be at least 2 char"),
    check("postType")
        .optional()
        .custom((val) => {
            if (!postType.includes(val)) throw new APIError(`${val} not exist in post type keywords!!`, 404)
            return true;
        }),
    validatorMW
];

export const hideUserPostsValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Post Id format!!")
        .custom(async (val, { req }) => {
            const isPostExist = await errorHandling(
                Post.findOne({ _id: val }).populate("userId", "friends")
            ) as PostSanitize;

            if (isPostExist) {
                const userId = isPostExist.userId as unknown as UserId

                if (userId.active === false) throw new APIError("Post Not Exist", 404);

                else if (
                    isPostExist.postType !== "private" &&
                    userId._id !== req.user._id.toString() ||
                    isPostExist.postType === "public"
                ) return true;

                else if (isPostExist.postType === "friends") {
                    if (
                        userId.friends.includes(val) ||
                        userId._id.toString() === req.user._id.toString()
                    ) return true
                    else throw new APIError("Your not access this post", 404);
                }
            }

            throw new APIError("post not found", 404);
        }),

    validatorMW
];

export const deletePostValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Post Id format!")
        .custom(async (val, { req }) => {
            const isPostExist = await errorHandling(
                Post.exists({ _id: val, userId: req.user._id }).lean()
            );
            if (isPostExist) return true;
            throw new APIError("Your post not exist", 404);
        }),
    validatorMW
];