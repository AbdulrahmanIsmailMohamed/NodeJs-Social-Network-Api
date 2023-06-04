import { check } from "express-validator";
import { errorHandling } from "../../utils/errorHandling";
import Post from '../../models/Post';
import APIError from "../../utils/apiError";
import { validatorMW } from '../../middlewares/validatorMW';
import { Comment } from '../../models/Comments';
import { CommentSanitize } from '../../interfaces/comments.interface';
import { PostSanitize } from '../../interfaces/post.interface';

export const createCommentValidator = [
    check("postId")
        .isMongoId()
        .withMessage("Invalid post id format!!")
        .custom(async (val, { req }) => {
            const isPostExist = await errorHandling(
                Post.findOne({ _id: val }).populate("userId", "friends")
            ) as PostSanitize;

            if (isPostExist) {
                const userId = isPostExist.userId as unknown as { _id: string; friends: string[] }

                if (
                    isPostExist.postType === "private" &&
                    userId._id === req.user._id.toString() ||
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
            /*
                if the user is not the owner comment,
                check if the user is the owner of the post containing the comment
            */
            const isOwnerPost = await errorHandling(
                Comment.findOne({ _id: val })
                    .select("postId")
                    .populate({
                        path: "postId",
                        match: { userId: req.user._id }
                    })
            ) as CommentSanitize
            console.log(isOwnerPost.postId);
            if (isOwnerPost.postId) return true;
            throw new APIError("comment not found", 404);
        }),
    validatorMW
];

export const getCommentValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Comment id format!!")
        .custom(async (val, { req }) => {
            const isCommentExist = await errorHandling(
                Comment.findOne({ _id: val })
                    .select("postId")
                    .populate({
                        path: "postId",
                        select: "postType userId",
                        match: { $or: [{ postType: "public" }, { postType: "friends" }] }
                    })
            ) as CommentSanitize;
            // if post type equal public => ok,else if it friends check if user exist in owner of the post friends 
            if (isCommentExist.postId) {
                const postId = isCommentExist.postId as unknown as { postType: string; userId: string }

                if (postId.postType === "public") return true;
                if (postId.postType === "friends") {
                    if (req.user.friends.includes(postId.userId)) return true
                }
            }
            throw new APIError("comment not found", 404);
        }),
    validatorMW
];

export const getPostCommentsValidator = [
    check("postId")
        .isMongoId()
        .withMessage("Invalid Comment id format!!")
        .custom(async (val, { req }) => {
            const isPostExist = await errorHandling(
                Post.findOne({
                    _id: val,
                    $or: [
                        { postType: "public" },
                        { postType: "friends" }
                    ]
                }).select("userId postType")
            ) as PostSanitize;
            if (isPostExist) {
                if (isPostExist.postType === "public") return true;
                else if (isPostExist.postType === "friends") {
                    if (req.user.friends.includes(isPostExist.userId)) return true;
                }
            }
            throw new APIError("Post not found", 404);
        }),
    validatorMW
];