import { check } from "express-validator";
import { errorHandling } from '../errorHandling';
import { Comment } from '../../models/Comments';

const createReplyValidator = [
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
                        }
                    })
            );
            console.log(isCommentExist);
            return true
        })
]