import { NextFunction, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandlerMW";
import FriendsService from "../services/friends.service";
import AuthenticatedRequest from "interfaces/authenticatedRequest.interface";
import APIError from "../utils/apiError";

class FriendsController {
    friendsService: FriendsService;
    constructor() {
        this.friendsService = new FriendsService();
    }

    friendRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userData = {
            userId: req.user._id,
            friendRequestId: req.params.id
        }
        const friendRequest = await this.friendsService.friendRequest(userData);
        if (!friendRequest) return next(new APIError("Can't add friend request id!!", 400));
        res.status(200).json({ status: "Success", message: friendRequest });
    });

    getFriendsRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const friendsRequest = await this.friendsService.getFriendsRequest(req.user._id);
        if (!friendsRequest) return next(new APIError("Not Found User", 404));
        res.status(200).json({ status: "Success", friendsRequest })
    });

    acceptFriendRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userData = {
            userId: req.user._id,
            friendRequestId: req.params.id
        }
        const user = await this.friendsService.acceptFriendRequest(userData);
        if (!user) return next(new APIError("Can't accept friend request", 404));
        res.status(200).json({ status: "Success", message: user });
    });

    cancelFriendRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userData = {
            userId: req.user._id,
            friendRequestId: req.params.id
        }
        const user = await this.friendsService.cancelFriendRequest(userData);
        if (!user) return next(new APIError("Can't cancel friend request", 404));
        res.status(200).json({ status: "Success", message: user });
    });

    deleteFriendFromFriends = asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const userData = {
                userId: req.user._id,
                friendId: req.params.id
            }
            const friends = await this.friendsService.deleteFriendFromFriends(userData);
            if (!friends) return next(new APIError("Can't delete friend", 400));
            res.status(200).json({ status: "Success", message: friends });
        }
    );

    getFriends = asyncHandler(
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const friends = await this.friendsService.getFriends(req.user._id);
            if (!friends) return next(new APIError("Not Found Friends", 404));
            res.status(200).json({ status: "Success", friends });
        }
    );
}

export default FriendsController;