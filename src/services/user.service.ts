import { ObjectId } from "mongoose";

import UserInterface from "../interfaces/user.Interface";
import User from "../models/User";
import { errorHandling } from "../utils/errorHandling";
import { APIFeature } from '../utils/apiFeature';

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
        const countDocument = await errorHandling(User.countDocuments({ active: true }));
        const apiFeature = new APIFeature(User.find({ active: true }), features)
            .search()
            .pagination(countDocument);
        const data = await errorHandling(apiFeature.exic());
        return data
    }

    getUser = async (userId: ObjectId): Promise<any> => {
        const user = await errorHandling(
            User.findById(userId)
                .select("-password -active")
        );
        return user;
    }
}

export default UserService;