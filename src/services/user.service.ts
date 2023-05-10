import UserInterface from "../interfaces/user.Interface";
import User from "../models/User";
import { errorHandling } from "../utils/errorHandling";

class UserService {
    createUser = async (userData: any): Promise<UserInterface> => {
        const user = await errorHandling(User.create(userData));
        return user;
    }
    updateUser = async (userData: UserInterface, userId: string): Promise<UserInterface> => {
        const user = await errorHandling(User.findByIdAndUpdate(userId, userData, { new: true }))
        return user
    }
    inActiveUser = async (userId: string): Promise<UserInterface> => {
        const user = await errorHandling(User.findByIdAndUpdate(
            userId,
            { active: false },
            { new: true }
        ));
        return user
    }
    getUsers = async () => {
        const users = errorHandling(await User.find({ active: true }));
        return users;
    }
}

export default UserService;