import { ObjectId } from 'mongoose';

import UserInterface from "../interfaces/user.Interface";
import User from "../models/User";
import { errorHandling } from "../utils/errorHandling";
import { APIFeature } from '../utils/apiFeature';
import SenitizeData from '../utils/senitizeData';

class UserService {
    private senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData()
    }

    updateUser = async (userData: UserInterface, userId: string | ObjectId): Promise<any> => {
        const user = await errorHandling(
            User.findByIdAndUpdate(userId, userData, { new: true })
                .select("firstName lastName profileImage address")
        )
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

    /** @access admin */
    getUsers = async (features: any): Promise<any> => {
        const countDocument = await errorHandling(User.countDocuments({ active: true }));
        const apiFeature = new APIFeature(User.find({ active: true }), features)
            .search()
            .pagination(countDocument);
        const data = await errorHandling(apiFeature.exic());
        return data
    }

    getUser = async (userId: ObjectId | string): Promise<any> => {
        const user = await errorHandling(
            User.findOne({ _id: userId, active: true })
                .select("firstName lastName profileImage address")
        );
        return user;
    }
}

export default UserService;