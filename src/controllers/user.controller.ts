import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";

import UserService from "../services/user.service";
import { asyncHandler } from '../middlewares/asyncHandlerMW';
import APIError from "../utils/apiError";
import AuthenticatedRequest from "interfaces/authenticatedRequest.interface";

class UserController {
    private userService: UserService;
    constructor() {
        this.userService = new UserService()
    }

    updateLoggedUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const user = await this.userService.updateLoggedUser(req.body, req.user._id);
        if (!user) return next(new APIError("The User Can't Be Updated!", 400));
        res.status(200).json({ status: "Success", user });
    });

    /**@access admin */
    getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const features = {
            keyword: req.query.keyword,
            limit: req.query.limit || 5,
            page: parseInt(req.query.page as string) || 1
        }
        const data = await this.userService.getUsers(features);
        if (!data) return next(new APIError("The users not found", 404));
        res.status(200)
            .json({
                status: "Success",
                paginationResult: {
                    countDocuments: data.users.length,
                    ...data.paginationResult
                },
                users: data.users
            });
    });

    getUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const userId: ObjectId | string = req.params.id ? req.params.id : req.user._id;

        const user = await this.userService.getUser(userId);
        if (!user) return next(new APIError("The user not found", 404));
        res.status(200).json({ status: "Success", user });
    });

    inactiveLoggedUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const user = await this.userService.inActiveLoggedUser(req.user._id);
        if (!user) return next(new APIError("The user Not found!", 404));
        res.status(200).json({ status: "Success", message: user });
    });
}

export default UserController;