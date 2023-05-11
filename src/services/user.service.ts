import bcrypt from 'bcrypt';

import APIError from "../utils/apiError";
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
    getUsers = async (): Promise<any> => {
        const users = errorHandling(await User.find({ active: true }));
        return users;
    }
    getUser = async (userId: string): Promise<any> => {
        const user = errorHandling(await User.findById(userId));
        return user;
    }
}

export default UserService;