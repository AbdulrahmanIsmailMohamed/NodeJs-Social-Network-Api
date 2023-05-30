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

export interface LoginSanitize {
    _id: string,
    name: string,
    email: string,
}

export interface ILogin extends LoginSanitize {
    password: string
}

export interface RegisterSanitize extends LoginSanitize {
    number: string,
    address: string,
}