import { NextFunction, Response } from 'express';

import { asyncHandler } from '../middlewares/asyncHandlerMW';
import { FollowersService } from '../services/followers.service';
import { AuthenticatedRequest } from '../interfaces/authentication.interface';
import APIError from '../utils/apiError';

export class FollowersControllor {
    private followersService: FollowersService;
    constructor() {
        this.followersService = new FollowersService()
    }

    followeUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const userId = req.user._id as string;
            const followeUserId: string = req.params.id;

            const followUser: string = await this.followersService.followUser(followeUserId, userId);
            if (!followUser) return next(new APIError("Can't add user to your follow list", 400));

            res.status(200).json({ status: "Success", message: followUser })
        }
        else return next(new APIError("Please login", 401));
    });

    unFolloweUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const userId = req.user._id as string;
            const followeUserId: string = req.params.id;

            const unFollowUser: string = await this.followersService.unFollowUser(userId, followeUserId);
            if (!unFollowUser) return next(new APIError("Can't Delete user from your follow list", 400));
            res.status(200).json({ status: "Success", message: unFollowUser })
        }
        else return next(new APIError("Please login", 401))
    });
    
    getFollowers = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {

        }
        else return new APIError("Please login", 401)
    });
}