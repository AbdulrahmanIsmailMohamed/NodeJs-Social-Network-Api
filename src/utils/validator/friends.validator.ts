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
            if (val === req.user._id.toString()) {
                throw new APIError("You can't send friendRequest for you", 400);
            }
            const isFriendIdExist = await errorHandling(
                User.exists({ _id: val })
            );
            if (!isFriendIdExist) {
                throw new APIError(`This id ${val} not exist`, 404);
            }

            const isUserExist = await errorHandling(
                User.findOne({ _id: req.user._id })
                    .select("limitFriendshipRequest friends myFriendshipRequests")
            );

            if (isUserExist) {
                if (isUserExist.limitFriendshipRequest >= 5000) {
                    throw new APIError("You have exceeded the limit for friend requests.", 400)
                }
                else if (isUserExist.limitFriends >= 5000) {
                    throw new APIError("You have exceeded the limit for friends.", 400)
                }
                else if (isUserExist.friends.includes(val)) {
                    throw new APIError("User Exist in your friends", 400);
                }
                else if (isUserExist.myFriendshipRequests.includes(val)) {
                    throw new APIError("You sent friendRequest to this user before", 400);
                }
            } else {
                throw new APIError("User Not Found", 404);
            }
            return true
        }),
    validatorMW
];

export const acceptFriendRequestValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid id format")
        .custom(async (val, { req }) => {
            const isExistUser = await errorHandling(
                User.findOne({ _id: req.user._id })
                    .select("limitFriends friendshipRequests friends")
            );

            if (isExistUser) {
                if (isExistUser.limitFriends >= 5000) {
                    throw new APIError("you have exceeded the limit for friends", 400);
                } else if (!isExistUser.friendshipRequests.includes(val)) {
                    throw new APIError("this user not exist in friendship requests", 400);
                } else if (isExistUser.friends.includes(val)) {
                    throw new APIError("This user is already exist in your friends", 400);
                }
                else {
                    return true
                }
            } else {
                throw new APIError("Can't accept this user", 400);
            }
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
            const isUserExistInMyFriendsRequests = await errorHandling(
                User.exists({ _id: req.user._id, myFriendshipRequests: val }).lean()
            )
            const isUserExistInFriendsRequests = await errorHandling(
                User.exists({ _id: val, friendshipRequests: req.user._id }).lean()
            )

            if (isUserExistInMyFriendsRequests && isUserExistInFriendsRequests) return true

            throw new APIError("You can't cancel this friend request!", 404);
        }),
    validatorMW
];

export const getUserFriendsValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid user id format!!")
        .custom(async (val) => {
            const user = await errorHandling(
                User.exists({ _id: val, active: true })
            )
            if (!user) throw new APIError("Can't find this user", 404);
            return true;
        }),
    validatorMW
];