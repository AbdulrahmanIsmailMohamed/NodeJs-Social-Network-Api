import { NextFunction, Request, Response } from "express";

import UserService from "../services/user.service";
import { asyncHandler } from '../middlewares/asyncHandlerMW';
import APIError from "../utils/apiError";
import { AuthenticatedRequest } from "interfaces/authentication.interface";
import { GetUser, UpdateLoggedUser } from "../interfaces/user.Interface";
import { Features, GetAPIFeaturesResult } from "../interfaces/post.interface";

class UserController {
    private userService: UserService;
    constructor() {
        this.userService = new UserService()
    }

    updateLoggedUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const userBody: UpdateLoggedUser = {
                userId: req.user._id as string,
                name: req.body.name,
                address: req.body.address,
                number: req.body.number
            }

            const user: GetUser = await this.userService.updateLoggedUser(userBody);
            if (!user) return next(new APIError("The User Can't Be Updated!", 400));
            res.status(200).json({ status: "Success", user });
        }
        else return next(new APIError("Please login", 401));
    });

    /**@access admin */
    getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const features: Features = {
            keyword: req.query.keyword as string,
            limit: parseInt(req.query.limit as string) || 5,
            page: parseInt(req.query.page as string) || 1
        }

        const result: GetAPIFeaturesResult = await this.userService.getUsers(features);
        if (!result) return next(new APIError("The users not found", 404));
        const { paginationResult, data } = result;

        res.status(200).json({
            status: "Success",
            paginationResult,
            users: data
        });
    });

    getUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userId: string = req.params.id || (req.user && req.user._id as string) || "please login";

        const user: GetUser = await this.userService.getUser(userId);
        if (!user) return next(new APIError("The user not found", 404));
        res.status(200).json({ status: "Success", user });
    });

    inactiveLoggedUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const user: string = await this.userService.inActiveLoggedUser(req.user._id as string);
            if (!user) return next(new APIError("The user Not found!", 404));
            res.status(200).json({ status: "Success", message: user });
        }
        else return next(new APIError("Please login", 401))
    });

}

export default UserController;