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
        const isUserExist = await errorHandling(
            User.exists({
                _id: userData.userId,
                friends: userData.friendRequestId
            })
        );
        console.log(isUserExist);

        if (!isUserExist) {
            const friendRequest = await errorHandling(
                User.findByIdAndUpdate(
                    userData.userId,
                    { $addToSet: { friendsRequest: userData.friendRequestId } },
                    { new: true }
                )
            );
            console.log(friendRequest);

            if (!friendRequest) throw new APIError("Can't Add fried request id!!", 400);
            return friendRequest;
        }
        else throw new APIError("User is exist in friends", 400);
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
        if (!user.friends.includes(userData.friendRequestId)) {
            user.friends.push(userData.friendRequestId);
            await user.save();
            return user;
        }
        else throw new APIError("the user is already exist in friends", 400);
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