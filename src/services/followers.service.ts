import { errorHandling } from '../utils/errorHandling';
import APIError from '../utils/apiError';
import User from '../models/User';
import { IUser } from '../interfaces/user.Interface';

export class FollowersService {

    followUser = async (followUserId: string, userId: string): Promise<string> => {
        // add userId to followUsersList Array and add one to number of followers user
        let operations = [
            {
                updateOne: {
                    filter: { _id: userId },
                    update: {
                        $addToSet: { followUsers: followUserId },
                    }

                }
            },
            {
                updateOne: {
                    filter: { _id: followUserId },
                    update: {
                        $addToSet: { followers: userId },
                        $inc: { numberOfFollowers: +1 }
                    }
                }
            },
        ];

        const result = await User.bulkWrite(operations as [], {});
        if (result.modifiedCount < 0) {
            throw new APIError("Can't Add user to your followers list!!", 400);
        }

        return "The person has been added to your followers";
    }

    unFollowUser = async (userId: string, followUserId: string): Promise<string> => {
        let operations = [
            {
                updateOne: {
                    filter: { _id: userId },
                    update: {
                        $pull: { followUsers: followUserId },
                    }

                }
            },
            {
                updateOne: {
                    filter: { _id: followUserId },
                    update: {
                        $pull: { followers: userId },
                        $inc: { numberOfFollowers: -1 }
                    }
                }
            },
        ];

        const result = await User.bulkWrite(operations as [], {});
        if (result.modifiedCount < 0) {
            throw new APIError("Can't Delete user from your followers list!!", 400);
        }
        
        return "The person has been deleted from your followers";
    }

    getFollowes = async (userId: string): Promise<IUser> => {
        const followUsers = await errorHandling(User.findById(userId).select("followers followUsers numberOfFollowers")) as IUser;
        if (!followUsers) throw new APIError("Can't find user", 404);
        return followUsers;
    }

}