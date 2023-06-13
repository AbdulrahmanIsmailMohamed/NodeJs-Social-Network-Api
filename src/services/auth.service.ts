import bcrypt from 'bcrypt';

import User from "../models/User";
import { errorHandling } from "../utils/errorHandling";
import APIError from '../utils/apiError';
import SenitizeData from '../utils/sanitizeData';
import { ILogin, LoginBody, LoginSanitize, RegisterBody, RegisterSanitize } from '../interfaces/authentication.interface';

class AuthService {
    private senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData();
    }

    register = async (registerBody: RegisterBody): Promise<RegisterSanitize> => {
        const user = await errorHandling(User.create(registerBody)) as RegisterSanitize;
        
        if (!user) throw new APIError("event error when you registerd", 400);
        return this.senitizeData.userRegister(user);
    }

    login = async (loginBody: LoginBody): Promise<LoginSanitize> => {
        const { email, password } = loginBody;

        const user = await errorHandling(
            User.findOneAndUpdate(
                { email },
                { active: true },
                { new: true }
            )
        ) as ILogin;

        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new APIError("Invalid email or password", 401);
        }

        return this.senitizeData.userLogin(user);
    }

}

export default AuthService;