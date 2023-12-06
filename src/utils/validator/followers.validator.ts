import { check } from "express-validator";
import { errorHandling } from "../errorHandling";
import User from "../../models/User";
import APIError from "../apiError";
import { validatorMW } from "../../middlewares/validatorMW";

export const followUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid UserId Format!")
    .custom(async (val, { req }) => {
      if (val === req.user._id.toString())
        throw new APIError("Can't follow your self", 400);
      const isUserExist = await errorHandling(
        User.findOne({ _id: val, active: true }).exec()
      );

      if (isUserExist) {
        if (isUserExist.followers?.includes(req.user._id)) {
          throw new APIError("You Follow this user", 400);
        } else {
          return true;
        }
      } else throw new APIError("Can't find User", 404);
    }),
  validatorMW,
];

export const unFollowUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid UserId Format!")
    .custom(async (val, { req }) => {
      if (val === req.user._id.toString())
        throw new APIError("Occur Error", 400);
      const isUserExist = await errorHandling(
        User.findOne({ _id: val, active: true }).exec()
      );

      if (isUserExist) {
        if (!isUserExist.followers?.includes(req.user._id)) {
          throw new APIError("You Un Follow this user", 400);
        } else {
          return true;
        }
      } else throw new APIError("Can't find User", 404);
    }),
  validatorMW,
];

export const getFollowersValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid UserId Format!")
    .custom(async (val, { req }) => {
      const isUserExist = await errorHandling(
        User.findOne({ _id: val, active: true }).exec()
      );
      if (isUserExist) return true;
      else throw new APIError("Can't find User", 404);
    }),
  validatorMW,
];
