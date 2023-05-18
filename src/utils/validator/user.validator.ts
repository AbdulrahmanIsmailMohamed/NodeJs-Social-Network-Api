import { check } from "express-validator";

import { validatorMW } from "../../middlewares/validatorMW";
import User from "../../models/User";
import APIError from "../apiError";
import { errorHandling } from "../errorHandling";

export const userIdValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid User Id"),
    validatorMW
]

export const updateUser = [
    check("id")
        .isMongoId()
        .withMessage("Invalid userid format"),
    check("email")
        .optional()
        .notEmpty()
        .withMessage("The email must be not null")
        .isEmail()
        .withMessage("This email not valid")
        .custom(async (val, { req }) => {
            const user = await errorHandling(User.findOne({ email: val }));
            if (user)
                return Promise.reject(new APIError("Your email Is exist, please Enter another email", 400));
            return true
        }),
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