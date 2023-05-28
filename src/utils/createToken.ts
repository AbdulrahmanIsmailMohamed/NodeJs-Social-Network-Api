import jwt from "jsonwebtoken";
import UserInterface from '../interfaces/user.Interface';

export const createToken = (user: UserInterface) =>
    jwt.sign(
        { userId: user._id },
        process.env.JWT_SEC,
        { expiresIn: process.env.JWT_EXPIRE }
    )