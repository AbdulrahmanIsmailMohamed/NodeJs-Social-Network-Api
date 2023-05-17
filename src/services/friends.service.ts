import { errorHandling } from "../utils/errorHandling";
import User from "../models/User";
import APIError from "../utils/apiError";
import SenitizeData from "../utils/senitizeData";
import { ObjectId } from "mongoose";

type BulkWriteOperation<T> =
    | {
        updateOne: {
            filter: T;
            update: { $addToSet: { friendshipRequests: any } };
        };
    }
    | {
        updateOne: {
            filter: T;
            update: { $addToSet: { myFriendshipRequests: any } };
        };
    };

class FriendsService {
    senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData()
    }

    sendFriendRequest = async (data: any): Promise<any> => {
        const { userId, friendId } = data;
        let operations: BulkWriteOperation<any>[] = [
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
                    update: { $addToSet: { myFriendshipRequests: friendId } },
                }
            }
        ];

        const result = await errorHandling(
            User.bulkWrite(operations as any[], {})
        );

        if (result.modifiedCount < 0) {
            throw new APIError("Can't Add friedship request id!!", 400);
        }
        return "Friendship request sent";
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
        const { userId, friendId } = userData;
        const operations = [
            {
                updateOne: {
                    filter: { _id: userId },
                    update: {
                        $pull: { myFriendshipRequests: friendId },
                        $addToSet: { friends: friendId }
                    },
                },
            },
            {
                updateOne: {
                    filter: { _id: friendId },
                    update: {
                        $pull: { friendshipRequests: userId },
                        $addToSet: { friends: userId }
                    },
                }
            }
        ];

        const result = await errorHandling(
            User.bulkWrite(operations as [], {})
        );

        if (result.modifiedCount < 0) {
            throw new APIError("The user is already exist in friends", 400);
        }
        return "The friendship request was accepted"
    }

    cancelFriendRequest = async (userData: any): Promise<any> => {
        const { userId, friendId } = userData;
        const operations = [
            {
                updateOne: {
                    filter: { _id: userId },
                    update: {
                        $pull: { myFriendshipRequests: friendId },
                    },
                },
            },
            {
                updateOne: {
                    filter: { _id: friendId },
                    update: {
                        $pull: { friendshipRequests: userId },
                        $addToSet: { friends: userId }
                    },
                }
            }
        ];

        const result = await errorHandling(
            User.bulkWrite(operations as [], {})
        );
        if (result.modifiedCount < 0) {
            throw new APIError("Can't Find User for this id!!", 404);
        }
        return "Friend request cancelled";
    }

    deleteFriendFromFriends = async (userData: any): Promise<string> => {
        const { userId, friendId } = userData;
        const operations = [
            {
                updateOne: {
                    filter: { _id: userId },
                    update: { $pull: { friends: friendId } }
                }
            },
            {
                updateOne: {
                    filter: { _id: friendId },
                    update: { $pull: { friends: userId } }
                }
            }
        ];

        const result = await errorHandling(
            User.bulkWrite(operations as [], {})
        );
        if (result.modifiedCount < 0) {
            throw new APIError("Can't delete your friend!!", 400);
        }
        return "Your Friend has been removed";
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