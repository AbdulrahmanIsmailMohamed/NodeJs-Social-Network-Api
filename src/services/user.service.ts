import { ObjectId } from 'mongoose';

import UserInterface from "../interfaces/user.Interface";
import User from "../models/User";
import { errorHandling } from "../utils/errorHandling";
import { APIFeature } from '../utils/apiFeature';
import SenitizeData from '../utils/sanitizeData';
import APIError from '../utils/apiError';

class UserService {
    private senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData()
    }

    updateLoggedUser = async (userData: UserInterface, userId: string | ObjectId): Promise<any> => {
        const { name, address, number } = userData
        const user = await errorHandling(
            User.findOneAndUpdate(
                { _id: userId, active: true },
                { name, address, number },
                { new: true }
            ).select("name profileImage address")
        );
        if (!user) throw new APIError("Can't update your data", 400);
        return user
    }

    inActiveLoggedUser = async (userId: ObjectId | string): Promise<string> => {
        const user = await errorHandling(
            User.findOneAndUpdate(
                { _id: userId },
                { active: false }
            ));
        if (!user) throw new APIError("Can't inactive this user", 400);
        return "Your profile is inactive"
    }

    /** @access admin */
    getUsers = async (features: any): Promise<any> => {
        const countDocument = await errorHandling(User.countDocuments({ active: true }));
        const apiFeature = new APIFeature(User.find({ active: true }), features)
            .search()
            .pagination(countDocument);
        const data = await errorHandling(apiFeature.exic("users"));
        if (!data) throw new APIError("can't find users", 404)
        return data
    }

    getUser = async (userId: ObjectId | string): Promise<any> => {
        const user = await errorHandling(
            User.findOne({ _id: userId, active: true })
                .select("name profileImage address")
        );
        if (!user) throw new APIError("can't find this user", 404);
        return user;
    }
}

export default UserService;