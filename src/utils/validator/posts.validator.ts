import { check } from "express-validator";

import { validatorMW } from "../../middlewares/validatorMW";

export const postIdValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid post id validator"),
    validatorMW
];

export const createPostValidor = [
    check("post")
        .notEmpty()
        .withMessage("The post is required")
        .isString()
        .withMessage("The post must be string")
        .isLength({ min: 1 })
        .withMessage("The post is must be at least 2 char"),
    validatorMW
];

export const updatePostValidor = [
    check("id")
        .isMongoId()
        .withMessage("Invalid post id validator"),
    check("post")
        .optional()
        .notEmpty()
        .withMessage("The post is required")
        .isString()
        .withMessage("The post must be string")
        .isLength({ min: 1 })
        .withMessage("The post is must be at least 2 char"),
    validatorMW
];