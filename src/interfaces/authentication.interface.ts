import { Request } from "express";

import { IUser } from "./user.Interface";

export interface AuthenticatedRequest extends Request {
    user?: IUser
}

export interface RegisterBody {
    name: string,
    email: string,
    password: string,
    number: string
}

export interface LoginBody {
    email: string,
    password: string
}