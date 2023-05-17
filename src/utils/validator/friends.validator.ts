import { check } from "express-validator";
import APIError from "../apiError";
import { validatorMW } from "../../middlewares/validatorMW";
import { errorHandling } from "../errorHandling";
import User from "../../models/User";

export const sendFriendRequestValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid id format")
        .custom(async (val, { req }) => {
            if (val === req.user._id.toString())
                throw new APIError("You can't send friendRequest for you", 400);
            const isFriend = await errorHandling(
                User.exists({
                    _id: req.user._id,
                    friends: val,
                }).lean()
            );
            const isFriendRequestExist = await errorHandling(
                User.exists({
                    _id: req.user._id,
                    myFriendshipRequests: val,
                }).lean()
            );
            if (isFriend)
                throw new APIError("this user is exist in your friends", 400);
            if (isFriendRequestExist)
                throw new APIError("You have already sent a friend request to this user", 400);
            return true
        }),
    validatorMW
];

export const acceptFriendRequestValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid id format")
        .custom(async (val, { req }) => {
            const isExistInfriendRequest = await errorHandling(
                User.exists({
                    _id: req.user._id,
                    friendshipRequests: val,
                    friends: { $ne: val }
                }).lean()
            );
            if (isExistInfriendRequest) return true
            throw new APIError("Can't accept this user", 400);
        }),
    validatorMW
];

export const deleteFriendValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid id format")
        .custom(async (val, { req }) => {
            const isFriend = await errorHandling(
                User.exists({
                    _id: req.user._id,
                    friends: val
                }).lean()
            );
            if (isFriend) return true;
            throw new APIError("Your friend is already deleted!!", 400);
        }),
    validatorMW
];