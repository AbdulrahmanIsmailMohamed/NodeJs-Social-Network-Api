import { errorHandling } from "../utils/errorHandling";
import User from "../models/User";
import APIError from "../utils/apiError";
import SenitizeData from "../utils/sanitizeData";
import {
    FriendshipRequests,
    MyFriendshipRequests,
    FriendRequest,
    Friends
} from "../interfaces/friends.interface";

class FriendsService {
    senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData()
    }

    sendFriendRequest = async (userData: FriendRequest): Promise<string> => {
        const { userId, friendId } = userData;

        let operations = [
            // add operation to update friends's documents
            {
                updateOne: {
                    filter: { _id: friendId },
                    update: { $addToSet: { friendshipRequests: userId } },
                }
            },
            // add operation to update my documents
            {
                updateOne: {
                    filter: { _id: userId },
                    update: {
                        $addToSet: { myFriendshipRequests: friendId },
                        $inc: { limitFriendshipRequest: 1 }
                    }
                },
            }
        ];
        const result = await User.bulkWrite(operations as [], {});
        if (result.modifiedCount < 0) {
            throw new APIError("Can't Add friedship request id!!", 400);
        }
        return "Friendship request sent";
    }

    getFriendsRequest = async (userId: string): Promise<FriendshipRequests> => {
        const user = await errorHandling(
            User.findById(userId)
                .select("friendshipRequests")
                .populate("friendshipRequests", "name profileImage")
        ) as FriendshipRequests;
        if (!user) throw new APIError("Not Found User", 404);
        return user
    }

    getMyFriendsRequest = async (userId: string): Promise<MyFriendshipRequests> => {
        const myFriendsRequest = await errorHandling(
            User.findById(userId)
                .select("myFriendshipRequests")
                .populate("myFriendshipRequests", "name profileImage")
        ) as MyFriendshipRequests;
        if (!myFriendsRequest) throw new APIError("Not Found User", 404);
        return myFriendsRequest
    }

    acceptFriendRequest = async (userData: FriendRequest): Promise<string> => {
        const { userId, friendId } = userData;

        const operations = [
            {
                updateOne: {
                    filter: {
                        _id: userId,
                    },
                    update: {
                        $pull: { friendshipRequests: friendId },
                        $addToSet: { friends: friendId },
                        $inc: { limitFriends: 1 }
                    },
                },
            },
            {
                updateOne: {
                    filter: {
                        _id: friendId,
                    },
                    update: {
                        $pull: { myFriendshipRequests: userId },
                        $addToSet: { friends: userId },
                        $inc: { limitFriendshipRequest: -1, limitFriends: 1 },
                    },
                }
            }
        ];

        const result = await User.bulkWrite(operations as [], {})

        if (result.modifiedCount < 0) {
            throw new APIError("The user is already exist in friends", 400);
        }
        return "The friendship request was accepted"
    }

    cancelFriendRequest = async (userData: FriendRequest): Promise<string> => {
        const { userId, friendId } = userData;

        const operations = [
            {
                updateOne: {
                    filter: { _id: userId },
                    update: {
                        $pull: { myFriendshipRequests: friendId },
                        $inc: { limitFriendshipRequest: -1 }
                    },
                },
            },
            {
                updateOne: {
                    filter: { _id: friendId },
                    update: {
                        $pull: { friendshipRequests: userId },
                    },
                }
            }
        ];

        const result = await User.bulkWrite(operations as [], {})
        if (result.modifiedCount < 0) {
            throw new APIError("Can't Find User for this id!!", 404);
        }
        return "Friend request cancelled";
    }

    deleteFriendFromFriends = async (userData: FriendRequest): Promise<string> => {
        const { userId, friendId } = userData;

        const operations = [
            {
                updateOne: {
                    filter: { _id: userId },
                    update: {
                        $pull: { friends: friendId },
                        $inc: { limitFriends: -1 }
                    }
                }
            },
            {
                updateOne: {
                    filter: { _id: friendId },
                    update: {
                        $pull: { friends: userId },
                        $inc: { limitFriends: -1 }
                    }
                }
            }
        ];

        const result = await User.bulkWrite(operations as [], {})
        if (result.modifiedCount < 0) {
            throw new APIError("Can't delete your friend!!", 400);
        }
        return "Your Friend has been removed";
    }

    getFriends = async (userId: string): Promise<Friends> => {
        const friends = await errorHandling(
            User.findById(userId)
                .select("friends")
                .populate("friends", "name profileImage")
        ) as Friends;
        if (!friends) throw new APIError("Can't Find friends For this id!!", 404);
        return friends;
    }
}

export default FriendsService;