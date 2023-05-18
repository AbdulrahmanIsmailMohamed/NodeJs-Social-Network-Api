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

            const isUserExistInFriends = await errorHandling(
                User.exists({
                    _id: req.user._id,
                    friends: val,
                }).lean()
            );
            if (isUserExistInFriends)
                throw new APIError("this user in your friends", 400);

            const isUserExistInMyFriendsRequests = await errorHandling(
                User.exists({
                    _id: req.user._id,
                    myFriendshipRequests: val,
                }).lean()
            );
            if (isUserExistInMyFriendsRequests)
                throw new APIError("You have sent a friend request to this person before", 400);

            const isUserExistInFriendsRequests = await errorHandling(
                User.exists({
                    _id: req.user._id,
                    friendshipRequests: val,
                }).lean()
            );
            if (isUserExistInFriendsRequests)
                throw new APIError("This user in your friendsRequests,now you can accept this", 400);

            console.log(isUserExistInFriends, isUserExistInFriendsRequests, isUserExistInMyFriendsRequests);

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
            throw new APIError("this user is not exist!!", 400);
        }),
    validatorMW
];

export const cancelFriendRequestValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid id format")
        .custom(async (val, { req }) => {
            if (val === req.user._id.toString()) {
                throw new APIError("Can't cancel this user", 400)
            }  
        }),
    validatorMW
];