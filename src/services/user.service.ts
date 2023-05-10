import User from "../models/User";
import { errorHandling } from "../utils/errorHandling";

class UserService {
    createUser = async (userData: any)=> {
        const user = await errorHandling(User.create(userData));
        return user;
    }
}

export default UserService;