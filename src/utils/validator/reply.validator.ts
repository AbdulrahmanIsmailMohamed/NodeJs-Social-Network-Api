import { check } from "express-validator";
import { errorHandling } from '../errorHandling';
import { Comment } from '../../models/Comments';
import { validatorMW } from '../../middlewares/validatorMW';
import APIError from '../apiError';

export const createReplyValidator = [
    check("commentId")
        .isMongoId()
        .withMessage("Invalid Comment Id format!!")
        .custom(async (val, { req }) => {
            const isCommentExist = await errorHandling(
                Comment.findById(val)
                    .select("postId")
                    .populate({
                        path: "postId",
                        match: {
                            $or: [
                                { postType: "public" },
                                { postType: "friends" }
                            ]
                        },
                        select: "userId postType"
                    })
            );
            if (isCommentExist.postId) {
                if (isCommentExist.postId.postType === "public") return true;
                if (isCommentExist.postId.postType === "friends") {
                    if (req.user.friends.includes(isCommentExist.postId.userId)) return true
                }
                throw new APIError("Can't create reply for this comment", 400)
            }
            throw new APIError("Can't create reply for this comment", 400)
        }),
    validatorMW
];

export const getReplysValidator = [
    check("commentId")
        .isMongoId()
        .withMessage("Invalid Comment Id format!!")
        .custom(async (val, { req }) => {
            const isCommentExist = await errorHandling(
                Comment.findById(val)
                    .select("postId")
                    .populate({
                        path: "postId",
                        match: {
                            $or: [
                                { postType: "public" },
                                { postType: "friends" }
                            ]
                        },
                        select: "userId postType"
                    })
            );
            if (isCommentExist.postId) {
                if (isCommentExist.postId.postType === "public") return true;
                if (isCommentExist.postId.postType === "friends") {
                    if (req.user.friends.includes(isCommentExist.postId.userId)) return true
                }
                throw new APIError("Can't Get replys for this comment", 404)
            }
            throw new APIError("Can't Get replys for this comment", 404)
        }),
    validatorMW
];

export const deleteReplyValidator = [
    check("commentId")
        .isMongoId()
        .withMessage("Invalid Comment Id format!!")
        .custom(async (val, { req }) => {
            const isCommentExist = await errorHandling(
                Comment.findById(val)
                    .select("postId")
                    .populate({
                        path: "postId",
                        match: {
                            $or: [
                                { postType: "public" },
                                { postType: "friends" }
                            ]
                        },
                        select: "userId postType"
                    })
            );
            if (isCommentExist.postId) {
                if (isCommentExist.postId.postType === "public") return true;
                if (isCommentExist.postId.postType === "friends") {
                    if (req.user.friends.includes(isCommentExist.postId.userId)) return true
                }
                throw new APIError("Can't delete reply for this comment", 400)
            }
            throw new APIError("Can't delete reply for this comment", 400)
        }),

    check("replyId")
        .isMongoId()
        .withMessage("Invalid Comment Id format!!")
        .custom(async (val, { req }) => {
            const isReplyExist = await errorHandling(
                Comment.exists({
                    _id: req.params.commentId,
                    reply: { $elemMatch: { _id: req.params.replyId } }
                })
            )
            if (isReplyExist) return true;
            throw new APIError("Can't find reply for this comment", 404)
        })
    , validatorMW
];