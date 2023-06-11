import { check } from "express-validator";
import { errorHandling } from '../errorHandling';
import Post from '../../models/Post';
import APIError from '../apiError';
import { validatorMW } from '../../middlewares/validatorMW';

export const addFavouriteValidator = [
    check("postId")
        .isMongoId()
        .withMessage("Invalid Post Id Format!!")
        .custom(async (val) => {
            const isPostExist = await errorHandling(Post.exists({ _id: val }));
            if (!isPostExist) throw new APIError("Post not found!!", 404);
            return true;
        }),
    validatorMW
];