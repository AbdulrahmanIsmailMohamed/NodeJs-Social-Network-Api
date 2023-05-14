import UserInterface from "../interfaces/user.Interface";
import User from "../models/User";
import { errorHandling } from "../utils/errorHandling";

class UserService {
    updateUser = async (userData: UserInterface, userId: string): Promise<any> => {
        const user = await errorHandling(User.findByIdAndUpdate(userId, userData, { new: true }))
        return user
    }
    inActiveUser = async (userId: string): Promise<any> => {
        const user = await errorHandling(User.findByIdAndUpdate(
            userId,
            { active: false },
            { new: true }
        ));
        return user
    }
    getUsers = async (features: any): Promise<any> => {
        // search
        let filter = {};
        if (features.keyword) {
            filter = {
                $or: [
                    { firstName: { $regex: features.keyword, $options: "i" } },
                    { lastName: { $regex: features.keyword, $options: "i" } }
                ]
            }
        }
        // pagination
        const skip = (features.page - 1) * features.limit
        const users = await errorHandling(
            User.find({ $and: [filter, { active: true }] })
                .select("firstName lastName profileImage")
                .skip(skip)
                .limit(features.limit)
        );
        return { users, skip };
    }
    getUser = async (userId: string): Promise<any> => {
        const user = await errorHandling(
            User.findById(userId)
                .select("-password -active")
        );
        return user;
    }
}

export default UserService;