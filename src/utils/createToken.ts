import jwt from "jsonwebtoken";

export const createToken = (user: any) =>
    jwt.sign(
        { userId: user._id },
        process.env.JWT_SEC,
        { expiresIn: process.env.JWT_EXPIRE }
    )