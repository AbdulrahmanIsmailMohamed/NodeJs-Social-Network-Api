import { NextFunction, Response } from "express";

import { asyncHandler } from "../middlewares/asyncHandlerMW";
import FriendsService from "../services/friends.service";
import { AuthenticatedRequest } from "interfaces/authentication.interface";
import APIError from "../utils/apiError";
import {
    FriendshipRequests,
    MyFriendshipRequests,
    FriendRequest,
    Friends
} from "../interfaces/friends.interface";

class FriendsController {
    friendsService: FriendsService;
    constructor() {
        this.friendsService = new FriendsService();
    }

    sendFriendRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const userData: FriendRequest = {
                userId: req.user._id as string,
                friendId: req.params.id
            }
            const friendRequest: string = await this.friendsService.sendFriendRequest(userData);
            if (!friendRequest) return next(new APIError("Can't add friend request id!!", 400));
            res.status(200).json({ status: "Success", message: friendRequest });
        }
        else return next(new APIError("Please login", 401));
    });

    getFriendsRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const friendsRequest: FriendshipRequests = await this.friendsService.getFriendsRequest(req.user._id as string);
            if (!friendsRequest) return next(new APIError("Not Found User", 404));
            res.status(200).json({ status: "Success", friendsRequest })
        }
        else return next(new APIError("Please login", 401));
    });

    getMyFriendsRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const myFriendsRequest: MyFriendshipRequests = await this.friendsService.getMyFriendsRequest(req.user._id as string);
            if (!myFriendsRequest) return next(new APIError("Not Found User", 404));
            res.status(200).json({ status: "Success", myFriendsRequest });
        }
        else return next(new APIError("Please login", 401));
    });

    acceptFriendRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const userData: FriendRequest = {
                userId: req.user._id as string,
                friendId: req.params.id
            }
            const user: string = await this.friendsService.acceptFriendRequest(userData);
            if (!user) return next(new APIError("Can't accept friend request", 404));
            res.status(200).json({ status: "Success", message: user });
        }
        else return next(new APIError("Please login", 401));
    });

    cancelFriendRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const userData: FriendRequest = {
                userId: req.user._id as string,
                friendId: req.params.id
            }
            const user = await this.friendsService.cancelFriendRequest(userData);
            if (!user) return next(new APIError("Can't cancel friend request", 404));
            res.status(200).json({ status: "Success", message: user });
        }
        else return next(new APIError("Please login", 401));
    });

    deleteFriendFromFriends = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user) {
            const userData: FriendRequest = {
                userId: req.user._id as string,
                friendId: req.params.id
            }
            const friends: string = await this.friendsService.deleteFriendFromFriends(userData);
            if (!friends) return next(new APIError("Can't delete friend", 400));
            res.status(200).json({ status: "Success", message: friends });
        }
        else return next(new APIError("Please login", 401));
    });

    getFriends = asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const userId: string = req.params.id ?? (req.user?._id) as string;

            const friends: Friends = await this.friendsService.getFriends(userId);
            if (!friends) return next(new APIError("Not Found Friends", 404));
            res.status(200).json({ status: "Success", friends });
        }
    );
}

export default FriendsController;