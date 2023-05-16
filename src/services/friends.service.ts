import { errorHandling } from "../utils/errorHandling";
import User from "../models/User";
import APIError from "../utils/apiError";
import SenitizeData from "../utils/senitizeData";
import { ObjectId } from "mongoose";
class FriendsService {
    senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData()
    }

    sendFriendRequest = async (userData: any): Promise<any> => {
        const isUserExist = await errorHandling(
            User.exists({
                _id: userData.userId,
                friends: userData.friendRequestId
            })
        );
        if (!isUserExist) {
            const friendRequest = await errorHandling(
                User.findByIdAndUpdate(
                    userData.userId,
                    { $addToSet: { friendsRequest: userData.friendRequestId } },
                    { new: true }
                )
            );
            if (!friendRequest) throw new APIError("Can't Add fried request id!!", 400);
            return "Friend request sent";
        }
        else throw new APIError("User is exist in friends", 400);
    }

    getFriendsRequest = async (userId: ObjectId): Promise<any> => {
        const user = await errorHandling(
            User.findById(userId)
                .select("friendsRequest")
                .populate("friendsRequest", "firstName lastName profileImage")
        );
        if (!user) throw new APIError("Not Found User", 404);
        return user
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

            // Add the friend ID of the person who sent the friend request
            await errorHandling(
                User.findByIdAndUpdate(
                    userData.friendRequestId,
                    {
                        $addToSet: { friends: userData.userId }
                    }
                )
            )
            await user.save();
            return "friend request approved";
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
        return "Friend request cancelled";
    }

    deleteFriendFromFriends = async (userData: any): Promise<string> => {
        const user = await errorHandling(
            User.findByIdAndUpdate(
                userData.userId,
                { $pull: { friends: userData.friendId } },
                { new: true }
            ).select("friends")
        );
        if (!user) throw new APIError("Can't Find User for this id!!", 404);
        return "The person has been removed from friends";
    }

    getFriends = async (userId: any) => {
        const friends = await errorHandling(
            User.findById(userId)
                .populate("friends", "firstName lastName profileImage")
        );
        if (!friends) throw new APIError("Can't Find frieds For this id!!", 404);
        return this.senitizeData.friends(friends);
    }
}

export default FriendsService;