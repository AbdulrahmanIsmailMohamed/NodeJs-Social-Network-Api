import { errorHandling } from "../utils/errorHandling";
import User from "../models/User";
import APIError from "../utils/apiError";
import SenitizeData from "../utils/senitizeData";

class FriendsService {
    senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData()
    }
    friendRequest = async (userData: any): Promise<any> => {
        const friendRequest = await errorHandling(
            User.findByIdAndUpdate(
                userData.userId,
                { $addToSet: { friendsRequest: userData.friendRequestId } },
                { new: true }
            )
        );
        if (!friendRequest) throw new APIError("Can't Add fried request id!!", 400);
        return friendRequest;
    }
    acceptFriendRequest = async (userData: any): Promise<any> => {
        const user = await errorHandling(
            User.findByIdAndUpdate(
                userData.userId,
                { $pull: { friendsRequest: userData.friendRequestId } },
                { new: true }
            )
        );
        if (!user) throw new APIError("Can't Find User for this id!!", 404);
        user.friends.push(userData.friendRequestId);
        await user.save();
        return user;
    }
    cancelFriendRequest = async (userData: any): Promise<string> => {
        const user = await errorHandling(
            User.findByIdAndUpdate(
                userData.userId,
                { $pull: { friendsRequest: userData.friendRequestId } },
                { new: true }
            )
        );
        if (!user) throw new APIError("Can't Find User for this id!!", 404);
        return "Done";
    }
    getFriends = async (userId: any) => {
        const friends = await errorHandling(User.findById(userId).populate("friends", "firstName lastName profileImage"));
        if (!friends) throw new APIError("Can't Find frieds For this id!!", 404);
        return this.senitizeData.friends(friends);
    }
}

export default FriendsService;