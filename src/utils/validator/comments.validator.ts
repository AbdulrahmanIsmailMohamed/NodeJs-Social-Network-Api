import { check } from "express-validator";
import { errorHandling } from "../../utils/errorHandling";
import Post from '../../models/Post';
import APIError from "../../utils/apiError";
import { validatorMW } from '../../middlewares/validatorMW';
import { Comment } from '../../models/Comments';

export const createCommentValidator = [
    check("postId")
        .isMongoId()
        .withMessage("Invalid post id format!!")
        .custom(async (val, { req }) => {
            const isPostExist = await errorHandling(
                Post.findOne({ _id: val }).populate("userId", "friends")
            );

            if (isPostExist) {
                if (
                    isPostExist.postType === "private" &&
                    isPostExist.userId._id === req.user._id.toString() ||
                    isPostExist.postType === "public"
                ) return true;

                else if (isPostExist.postType === "friends") {
                    if (
                        isPostExist.userId.friends.includes(val) ||
                        isPostExist.userId._id.toString() === req.user._id.toString()
                    ) return true
                    else throw new APIError("Your not access this post", 404);
                }
            }

            throw new APIError("post not found", 404);
        }),
    check("comment")
        .notEmpty()
        .withMessage("Comment must be not null")
        .isLength({ min: 1 })
        .withMessage("This comment is short")
        .isLength({ max: 1000 })
        .withMessage("This comment is long"),
    validatorMW
];

export const updateCommentValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Comment id format!!")
        .custom(async (val, { req }) => {
            const isCommentExist = await errorHandling(
                Comment.exists({ _id: val, userId: req.user._id }).lean()
            );
            if (isCommentExist) return true;
            throw new APIError("comment not found", 404);
        }),
    check("comment")
        .optional()
        .notEmpty()
        .withMessage("Comment must be not null")
        .isLength({ min: 1 })
        .withMessage("This comment is short")
        .isLength({ max: 1000 })
        .withMessage("This comment is long"),
    validatorMW
];

export const deleteCommentValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Comment id format!!")
        .custom(async (val, { req }) => {
            const isCommentExist = await errorHandling(
                Comment.exists({ _id: val, userId: req.user._id }).lean()
            );
            if (isCommentExist) return true;
            throw new APIError("comment not found", 404);
        }),
    validatorMW
];

export const getCommentValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Comment id format!!")
        .custom(async (val) => {
            const isCommentExist = await errorHandling(
                Comment.exists({ _id: val }).lean()
            );
            if (isCommentExist) return true;
            throw new APIError("comment not found", 404);
        }),
    validatorMW
];

export const getPostCommentsValidator = [
    check("postId")
        .isMongoId()
        .withMessage("Invalid Comment id format!!")
        .custom(async (val) => {
            const isPostExist = await errorHandling(
                Post.exists({ _id: val }).lean()
            );
            if (isPostExist) return true;
            throw new APIError("Post not found", 404);
        }),
    validatorMW
];