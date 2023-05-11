import bcrypt from 'bcrypt';
import { NextFunction } from 'express';

import User from "../models/User";
import { errorHandling } from "../utils/errorHandling";
import APIError from '../utils/apiError';
import SenitizeData from '../utils/senitizeData';

class AuthService {
    senitizeData: SenitizeData;
    constructor() {
        this.senitizeData = new SenitizeData()
    }
    register = async (userData: any): Promise<any> => {
        const user = await errorHandling(User.create(userData));
        return this.senitizeData.userRegister(user);
    }
    login = async (userData: any, next: NextFunction): Promise<any> => {
        const user = await errorHandling(User.findOneAndUpdate(
            { email: userData.email },
            { active: true },
            { new: true }
        ));
        if (!user || !bcrypt.compareSync(userData.password, user.password)) {
            return Promise.reject(new APIError("Invalid email or password", 401));
        }
        return this.senitizeData.userLogin(user);
    }
}

export default AuthService;