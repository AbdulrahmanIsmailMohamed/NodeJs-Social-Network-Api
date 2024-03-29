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
        User.exists({ _id: val }).exec()
      );
      if (!isFriendIdExist) {
        throw new APIError(`This id ${val} not exist`, 404);
      }

      const isUserExist = await errorHandling(
        User.findOne({ _id: req.user._id })
          .select(
            "limitFriendshipRequest limitFriends friends myFriendshipRequests"
          )
          .exec()
      );

      if (isUserExist) {
        if (
          isUserExist.limitFriendshipRequest &&
          isUserExist.limitFriendshipRequest >= 5000
        ) {
          throw new APIError(
            "You have exceeded the limit for friend requests.",
            400
          );
        } else if (
          isUserExist.limitFriends &&
          isUserExist.limitFriends >= 5000
        ) {
          throw new APIError("You have exceeded the limit for friends.", 400);
        } else if (isUserExist.friends && isUserExist.friends.includes(val)) {
          throw new APIError("User Exist in your friends", 400);
        } else if (
          isUserExist.myFriendshipRequests &&
          isUserExist.myFriendshipRequests.includes(val)
        ) {
          throw new APIError(
            "You sent a friend request to this user before",
            400
          );
        }
      } else {
        throw new APIError("User Not Found", 404);
      }

      return true;
    }),
  validatorMW,
];

export const acceptFriendRequestValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid id format")
    .custom(async (val, { req }) => {
      const isExistUser = await errorHandling(
        User.findOne({ _id: req.user._id })
          .select("limitFriends limitFriends friendshipRequests friends")
          .exec()
      );

      if (isExistUser) {
        if (isExistUser.limitFriends && isExistUser.limitFriends >= 5000) {
          throw new APIError("You have exceeded the limit for friends", 400);
        } else if (
          !isExistUser.friendshipRequests ||
          !isExistUser.friendshipRequests.includes(val)
        ) {
          throw new APIError(
            "This user does not exist in friendship requests",
            400
          );
        } else if (isExistUser.friends && isExistUser.friends.includes(val)) {
          throw new APIError("This user is already in your friends", 400);
        } else {
          return true;
        }
      } else {
        throw new APIError("Can't accept this user", 400);
      }
    }),
  validatorMW,
];

export const deleteFriendValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid id format")
    .custom(async (val, { req }) => {
      const isFriend = await errorHandling(
        User.exists({
          _id: req.user._id,
          friends: val,
        })
          .lean()
          .exec()
      );
      if (isFriend) return true;
      throw new APIError("this user is not exist!!", 400);
    }),
  validatorMW,
];

export const cancelFriendRequestValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid id format")
    .custom(async (val, { req }) => {
      if (val === req.user._id.toString()) {
        throw new APIError("Can't cancel this user", 400);
      }
      const isUserExistInMyFriendsRequests = await errorHandling(
        User.exists({ _id: req.user._id, myFriendshipRequests: val })
          .lean()
          .exec()
      );
      const isUserExistInFriendsRequests = await errorHandling(
        User.exists({ _id: val, friendshipRequests: req.user._id })
          .lean()
          .exec()
      );

      if (isUserExistInMyFriendsRequests && isUserExistInFriendsRequests)
        return true;

      throw new APIError("You can't cancel this friend request!", 404);
    }),
  validatorMW,
];

export const getUserFriendsValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid user id format!!")
    .custom(async (val) => {
      const user = await errorHandling(
        User.exists({ _id: val, active: true }).exec()
      );
      if (!user) throw new APIError("Can't find this user", 404);
      return true;
    }),
  validatorMW,
];
