import bcrypt from 'bcrypt';

import User from "../models/User";
import { errorHandling } from "../utils/errorHandling";
import APIError from '../utils/apiError';
import SenitizeData from '../utils/sanitizeData';
import { hashCode } from '../utils/hashCode';
import { sendMail } from '../utils/sendMail';

import {
    ILogin,
    LoginBody,
    LoginSanitize,
    RegisterBody,
    RegisterSanitize,
    AuthUser
} from '../interfaces/authentication.interface';
import { createToken } from '../utils/createToken';

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

    forgotPassword = async (email: string): Promise<string> => {
        const user = await errorHandling(User.findOne({ email }).select("email name")) as AuthUser;
        if (!user) throw new APIError("Can't find user for this email, please register", 404);

        // Generate hash reset random 6 digits and save via db
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.passwordResetCode = hashCode(resetCode);
        user.passwordResetCodeExpire = Date.now() + 10 * 60 * 1000;
        user.passwordResetVerified = false;
        await user.save();

        // send reset code via email by nodemailer
        const message = `
        <h2>Hi ${user.name}</h2>
        <p>We received a request to reset the password on your Social-Network Account.</p>
        <h3>${resetCode}</h3>
        <p>Enter this code to complete the reset</p>
        <p>Thanks for helping us keep your account secure</p>
        <p>The Social-Network Team</p>
      `;
        try {
            sendMail({
                email: user.email,
                message,
                subject: "Your Password Rest Code (Valid For 10 Minute)"
            });
        } catch (error) {
            user.passwordResetCode = undefined;
            user.passwordResetCodeExpire = undefined;
            user.passwordResetVerified = undefined;
            await user.save();

            throw new APIError("Internal Server Error", 500);
        }

        return "The Reset Code send via email"
    }

    verifyRestCode = async (resetCode: string): Promise<string> => {
        const user = await errorHandling(
            User.findOneAndUpdate(
                {
                    passwordResetCode: hashCode(resetCode),
                    passwordResetCodeExpire: { $gt: Date.now() }
                },
                { passwordResetVerified: true }
            )
        ) as AuthUser;
        if (!user) throw new APIError("ResetCode Invalid Or Expire", 400);
        return "Now You Can Change Password";
    }

    resetPassword = async (email: string, newPassword: string): Promise<string> => {
        const user = await errorHandling(
            User.findOne({ email }).select("password passwordResetCode passwordResetCodeExpire passwordResetVerified email")
        ) as AuthUser;

        if (!user) throw new APIError("This Email Not Exist, Please Register", 404)
        if (user.passwordResetVerified === false) throw new APIError("ResetCode Not Valid", 400)

        user.password = newPassword;
        user.passwordResetCode = undefined;
        user.passwordResetCodeExpire = undefined;
        user.passwordResetVerified = undefined;
        await user.save();

        return createToken(user._id)
    }
}

export default AuthService;