import { check } from "express-validator";
import { Availability, Condition, IMarketplace } from "../../interfaces/marketplace.interface";
import APIError from '../apiError';
import { validatorMW } from '../../middlewares/validatorMW';
import { errorHandling } from '../errorHandling';
import { Marketplace } from '../../models/Marketplace';

const availability: Array<string> = [
    Availability[0],
    Availability[1]
];
const condition: Array<string> = [
    Condition[0],
    Condition[1],
    Condition[2],
    Condition[3]
]

export const createItemForSaleValidator = [
    check("address")
        .notEmpty()
        .withMessage("Address must be not null")
        .isString()
        .withMessage("Address must be string")
        .isLength({ min: 5 })
        .withMessage("Address must be at least 5 char")
        .isLength({ max: 120 })
        .withMessage("Address must be least than 120 char"),
    check("availability")
        .notEmpty()
        .withMessage("Availability must be not null")
        .isString()
        .withMessage("Availability must be string")
        .custom((val) => {
            if (availability.includes(val) === true) return true;
            throw new APIError("Availability must contain a 'View As A Single' Or \n'Item view As Available' !!", 400)
        }),
    check("category")
        .notEmpty()
        .withMessage("category must be not null")
        .isLength({ min: 2 })
        .withMessage("category must be at least 2 char")
        .isLength({ max: 50 })
        .withMessage("category must be least that 50 char"),
    check("condition")
        .notEmpty()
        .withMessage("condition must be not null")
        .isString()
        .withMessage("condition must be string")
        .custom((val) => {
            if (condition.includes(val) === true) return true;
            throw new APIError("Wrong Answer", 400)
        }),
    check("price")
        .notEmpty()
        .withMessage("price must be not null")
        .isNumeric()
        .withMessage("Price Must Be number")
        .isLength({ min: 0 })
        .withMessage("price must be at least 1")
        .isLength({ max: 100 }),
    check("site")
        .notEmpty()
        .withMessage("site must be not null")
        .isLength({ min: 5 })
        .withMessage("site must be at least 5 char")
        .isLength({ max: 120 })
        .withMessage("site must be least than 120 char"),
    check("description")
        .optional()
        .isLength({ min: 5 })
        .withMessage("description must be at least 5 char")
        .isLength({ max: 500 })
        .withMessage("description must be least than 500 char"),
    check("tradMark")
        .optional()
        .isLength({ min: 5 })
        .withMessage("tradMark must be at least 5 char")
        .isLength({ max: 100 })
        .withMessage("tradMark must be least than 100 char"),

    validatorMW
];

export const updateItemForSaleValidator = [
    check("address")
        .optional()
        .notEmpty()
        .withMessage("Address must be not null")
        .isString()
        .withMessage("Address must be string")
        .isLength({ min: 5 })
        .withMessage("Address must be at least 5 char")
        .isLength({ max: 120 })
        .withMessage("Address must be least than 120 char"),
    check("availability")
        .optional()
        .notEmpty()
        .withMessage("Availability must be not null")
        .isString()
        .withMessage("Availability must be string")
        .custom((val) => {
            if (availability.includes(val) === true) return true;
            throw new APIError("Availability must contain a 'View As A Single' Or \n'Item view As Available' !!", 400)
        }),
    check("category")
        .optional()
        .notEmpty()
        .withMessage("category must be not null")
        .isLength({ min: 2 })
        .withMessage("category must be at least 2 char")
        .isLength({ max: 50 })
        .withMessage("category must be least that 50 char"),
    check("condition")
        .optional()
        .notEmpty()
        .withMessage("condition must be not null")
        .isString()
        .withMessage("condition must be string")
        .custom((val) => {
            if (condition.includes(val) === true) return true;
            throw new APIError("Wrong Answer", 400)
        }),
    check("price")
        .optional()
        .notEmpty()
        .withMessage("price must be not null")
        .isNumeric()
        .withMessage("Price Must Be number")
        .isLength({ min: 0 })
        .withMessage("price must be at least 1")
        .isLength({ max: 100 }),
    check("site")
        .optional()
        .notEmpty()
        .withMessage("site must be not null")
        .isLength({ min: 5 })
        .withMessage("site must be at least 5 char")
        .isLength({ max: 120 })
        .withMessage("site must be least than 120 char"),
    check("description")
        .optional()
        .optional()
        .isLength({ min: 5 })
        .withMessage("description must be at least 5 char")
        .isLength({ max: 500 })
        .withMessage("description must be least than 500 char"),
    check("tradMark")
        .optional()
        .isLength({ min: 5 })
        .withMessage("tradMark must be at least 5 char")
        .isLength({ max: 100 })
        .withMessage("tradMark must be least than 100 char"),

    validatorMW
];

export const itemForSaleValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Item Id Format!!")
        .custom(async (val, { req }) => {
            const isItemForSaleExist = await errorHandling(Marketplace.exists({ _id: val, userId: req.user._id })) as IMarketplace;
            if (!isItemForSaleExist) throw new APIError("Can't find item", 404)
            return true;
        }),

    validatorMW
]