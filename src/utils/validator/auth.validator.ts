import { check } from "express-validator";

import { validatorMW } from "../../middlewares/validatorMW";
import APIError from "../apiError";
import { errorHandling } from "../errorHandling";
import User from "../../models/User";

export const loginValidator = [
    check("email")
        .notEmpty()
        .withMessage("The email must be not null")
        .isEmail()
        .withMessage("This email not valid"),
    check("password")
        .notEmpty()
        .withMessage("The password must be not null"),
    validatorMW
];

export const registerValidor = [
    check("email")
        .notEmpty()
        .withMessage("The email must be not null")
        .isEmail()
        .withMessage("This email not valid")
        .custom(async (val, { req }) => {
            const user = await errorHandling(User.findOne({ email: val }));
            if (user)
                return Promise.reject(new APIError("Your email is exist, please login", 400));
            return true
        }),
    check("firstName")
        .notEmpty()
        .withMessage("The First name must be not null")
        .isString()
        .withMessage("The First name must be String")
        .isLength({ min: 2 })
        .withMessage("The First name is short")
        .isLength({ max: 15 })
        .withMessage("The First name is long"),
    check("lastName")
        .notEmpty()
        .withMessage("The Last name must be not null")
        .isString()
        .withMessage("The Last name must be String")
        .isLength({ min: 2 })
        .withMessage("The last name is short")
        .isLength({ max: 15 })
        .withMessage("The last name is long"),
    check("number")
        .optional()
        .notEmpty()
        .withMessage("The Number must be not null")
        .isString()
        .withMessage("The Number must be String")
        .isMobilePhone(["ar-EG", "ar-SA", "ar-YE"])
        .withMessage("This number invalid"),

    check("password")
        .notEmpty()
        .withMessage("The password must be not null")
        .isString()
        .withMessage("The password must be String")
        .isStrongPassword({
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1
        }),
    check("confirmPassword")
        .notEmpty()
        .withMessage("The password must be not null")
        .custom((val, { req }) => {
            if (req.body.password === val) return true;
            return Promise.reject(new APIError("The Passowrd and confirm password invalid!!", 400));
        }),
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