import jwt from "jsonwebtoken";

export const createToken = (userId: string) =>
    jwt.sign(
        { userId },
        process.env.JWT_SEC as string,
        { expiresIn: process.env.JWT_EXPIRE as string }
    )