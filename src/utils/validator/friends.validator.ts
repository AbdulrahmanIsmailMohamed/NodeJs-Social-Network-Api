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
            return true
        }),
    validatorMW
]

export const acceptFriendRequestValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid id format")
        .custom(async (val, { req }) => {
            const isExistInfriendRequest = await errorHandling(
                User.findOne({
                    _id: req.user._id,
                    friendsRequest: val
                })
            );
            console.log(isExistInfriendRequest);
            if (isExistInfriendRequest) return true
            throw new APIError("This Id not exist in friendsRequests", 400);
        }),
    validatorMW
]