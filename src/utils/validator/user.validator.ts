import { check } from "express-validator";

import { validatorMW } from "../../middlewares/validatorMW";
import User from "../../models/User";
import APIError from "../apiError";
import { errorHandling } from "../errorHandling";

export const getUserValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid User Id")
        .custom(async (val) => {
            const isUserExist = await errorHandling(
                User.exists({ _id: val, active: true }).lean()
            );
            if (isUserExist) return true;
            throw new APIError("this user not exist!!", 404);
        }),
    validatorMW
];

export const getUserPostsValidator = [
    check("userId")
        .isMongoId()
        .withMessage("Invalid User Id")
        .custom(async (val) => {
            const isUserExist = await errorHandling(
                User.exists({ _id: val, active: true }).lean()
            );
            if (isUserExist) return true;
            throw new APIError("this user not exist!!", 404);
        }),
    validatorMW
];

export const updateUserValidator = [
    check("name")
        .optional()
        .notEmpty()
        .withMessage("The name must be not null")
        .isString()
        .withMessage("The name must be String")
        .isLength({ min: 2 })
        .withMessage("The name is short")
        .isLength({ max: 50 })
        .withMessage("The name is long"),
    check("number")
        .optional()
        .optional()
        .notEmpty()
        .withMessage("The Number must be not null")
        .isString()
        .withMessage("The Number must be String")
        .isMobilePhone(["ar-EG", "ar-SA", "ar-YE"])
        .withMessage("This number invalid"),
    check("address")
        .optional()
        .notEmpty()
        .withMessage("The address must be not null")
        .isString()
        .withMessage("The address must be String")
        .isLength({ min: 2 })
        .withMessage("The address invalid"),
    validatorMW
];