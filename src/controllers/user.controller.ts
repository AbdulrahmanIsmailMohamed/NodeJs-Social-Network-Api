import { NextFunction, Request, Response } from "express";

import UserService from "../services/user.service";
import { asyncHandler } from '../middlewares/asyncHandlerMW';
import APIError from "../utils/apiError";

class UserController {
    private userService: UserService;
    constructor() {
        this.userService = new UserService()
    }
    createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = await this.userService.createUser(req.body);
        if (!user) return next(new APIError("The User Can't Be Created!", 400));
        res.status(201).json({ status: "Success", user });
    });
    updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = await this.userService.updateUser(req.body, req.params.id);
        if (!user) return next(new APIError("The User Can't Be Updated!", 400));
        res.status(200).json({ status: "Success", user });
    });
    getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const users = await this.userService.getUsers();
        if (!users) return next(new APIError("The users not found", 404));
        res.status(200).json({ status: "Success", result: users.length, users });
    });
    inactiveUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = await this.userService.inActiveUser(req.params.id);
        if (!user) return next(new APIError("The user Not found!", 404));
        res.status(200).json({ status: "Success" });
    });
}

export default UserController;