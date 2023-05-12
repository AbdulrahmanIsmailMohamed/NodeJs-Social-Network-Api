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
        res.status(200).json({ status: "Success", User: friendRequest });
    });
}

export default FriendsController;